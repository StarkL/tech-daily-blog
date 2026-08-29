---
title: "Scoop 国内安装实战：镜像加速与缓存预置全记录"
date: 2026-08-28
description: "在 GitHub 直连不通、PowerShell 模块损坏的双重地狱下，完成 Scoop 安装 + extras bucket + 微信安装，全程零失败"
---

# Scoop 国内安装实战：镜像加速与缓存预置全记录

> 2026-08-28 实操记录。环境：Windows 11，GitHub 直连不通、本机 PowerShell 5.1 部分模块损坏。
> 在这种"双重地狱"下完成了 Scoop 本体安装 + extras bucket 添加 + 7zip + 微信（4.1.13.12）安装，全程零失败落地。

## 一、结论速览

| 项目 | 结果 |
|------|------|
| Scoop | 0.5.3 安装成功，main / extras 两个 bucket |
| 7zip | 26.02（作为 Scoop 解压助手，必装） |
| 微信 | 4.1.13.12，extras bucket，开始菜单快捷方式 `Scoop Apps → WeChat` |
| 网络方案 | `gh-proxy.com` 镜像加速（实测最快），bucket 与 scoop 本体的 git remote 均已指向镜像 |
| 哈希校验 | 本机 `Get-FileHash` 损坏，改用 `sha256sum` 手动校验，全部通过 |

---

## 二、环境病灶（动手前先认清现实）

本次操作一共撞上三个环境问题，先列清楚，后面所有方案都是围绕它们展开的：

### 1. github.com 直连不通，但 raw.githubusercontent.com 间歇可用

```bash
curl -sI --max-time 10 https://github.com -o /dev/null -w "%{http_code}\n"          # 000（连接失败）
curl -sI --max-time 10 https://raw.githubusercontent.com -o /dev/null -w "%{http_code}\n"  # 301（通）
```

结论：**git clone / GitHub Releases 下载全部走不通**，必须借道镜像站。且网络不稳定，同一域名可能时通时断，别依赖单一结果。

### 2. PowerShell 5.1 的 Security 模块损坏

症状：`Get-ExecutionPolicy` 无法加载，报错 `CouldNotAutoloadMatchingModule`，手动 `Import-Module Microsoft.PowerShell.Security` 抛 `FormatXmlUpdateException`（TypeData 成员重复定义）。

影响：Scoop 官方安装脚本开头的执行策略检查直接崩。

### 3. `Get-FileHash` cmdlet 缺失（Microsoft.PowerShell.Utility 异常）

```powershell
# 纯净会话下直接报 CommandNotFoundException
Get-FileHash $env:TEMP\x.txt -Algorithm SHA256
```

影响：Scoop 的哈希校验必然失败 → 任何带哈希校验的安装都会中止。

> 💡 建议有空用管理员权限跑一次 `sfc /scannow` 修复，这是以上 PowerShell 问题的共同病根。本次操作用的是绕过方案，不是根治。

---

## 三、Scoop 本体安装

### 3.1 官方一键命令为什么失败

```powershell
irm get.scoop.sh | iex
```

两步都死：① `get.scoop.sh` 走 TLS 握手失败（强制 TLS 1.2 也没用）；② 即使脚本到手，脚本内部还要从 github.com 克隆/下载。

### 3.2 正确姿势：下载脚本 → 改写地址 → 补执行策略检查 → 执行

**第 1 步：从可达的 raw 域名下载安装脚本**

```bash
curl -sL https://raw.githubusercontent.com/ScoopInstaller/Install/master/install.ps1 -o /tmp/scoop-install.ps1
```

若 raw 域名当时也不通，把 URL 前面套一层镜像即可（见第四节镜像清单）。

**第 2 步：把脚本里所有 GitHub 地址替换为镜像地址**

```bash
sed -i 's|https://github.com/|https://gh-proxy.com/https://github.com/|g' /tmp/scoop-install.ps1
```

替换后会命中 4 个关键变量（脚本第 762~766 行附近）：

```powershell
$SCOOP_PACKAGE_REPO        = 'https://gh-proxy.com/https://github.com/ScoopInstaller/Scoop/archive/master.zip'
$SCOOP_MAIN_BUCKET_REPO    = 'https://gh-proxy.com/https://github.com/ScoopInstaller/Main/archive/master.zip'
$SCOOP_PACKAGE_GIT_REPO    = 'https://gh-proxy.com/https://github.com/ScoopInstaller/Scoop.git'
$SCOOP_MAIN_BUCKET_GIT_REPO = 'https://gh-proxy.com/https://github.com/ScoopInstaller/Main.git'
```

安装逻辑是：**优先 `git clone`，失败自动降级为 zip 下载**，两条路都已被镜像接管，双保险。

**第 3 步：兼容损坏的执行策略检查（本机 PowerShell 特有问题）**

把脚本中的：

```powershell
if ((Get-ExecutionPolicy).ToString() -notin $allowedExecutionPolicy) {
```

改为：

```powershell
if ((Get-Command Get-ExecutionPolicy -ErrorAction SilentlyContinue) -and (Get-ExecutionPolicy).ToString() -notin $allowedExecutionPolicy) {
```

命令不存在就跳过检查（反正用 `-ExecutionPolicy Bypass` 启动，本就合规）。

**第 4 步：执行**

```bash
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w /tmp/scoop-install.ps1)"
```

成功输出：

```
Initializing...
Downloading...
Creating shim...
Adding ~\scoop\shims to your path.
Scoop was installed successfully!
```

验证：

```bash
export PATH="$PATH:$USERPROFILE/scoop/shims"
scoop --version   # Current Scoop version: 0.5.3
```

**额外收益**：git clone 成功意味着 `~\scoop\apps\scoop\current` 和 `~\scoop\buckets\main` 的 git remote 天然指向镜像站，**以后 `scoop update` / `scoop bucket update main` 无需再折腾**。

---

## 四、GitHub 镜像站实测（2026-08-28）

选镜像必须实测速度，同一时刻各站差距可达 50 倍：

| 镜像站 | 可用性 | 下载微信时实测速度 |
|--------|--------|---------------------|
| `gh-proxy.com` | ✅ | **1.44 MB/s（首选）** |
| `ghfast.top` | ✅ | 494 KB/s |
| `gh-proxy.org` | ✅（初始快，持续传输掉速严重） | 约 26 KB/s |
| `ghproxy.net` / `github.moeyy.xyz` / `mirror.ghproxy.com` | ❌ 当时不可达 | — |

通用格式：`<镜像站>/<GitHub 原始 URL>`，对 `raw.githubusercontent.com`、`github.com/releases`、`api.github.com`、git 仓库地址均适用。

测速方法（取前 2MB 算速度）：

```bash
curl -s -r 0-2097151 --max-time 15 -o /dev/null -w "%{speed_download}\n" \
  "https://gh-proxy.com/https://github.com/<owner>/<repo>/releases/download/<tag>/<file>"
```

---

## 五、添加 extras bucket（微信在这里）

**关键认知**：`wechat` 不在默认的 main bucket，在 **extras**。`scoop bucket add extras` 本质是 `git clone github.com/ScoopInstaller/Extras`，本机必挂。

替代方案——手动克隆到 buckets 目录（Scoop 会自动识别该目录下的仓库）：

```bash
# extras 仓库很大（几千个清单 + 完整历史），务必浅克隆
git clone --depth 1 -q "https://gh-proxy.com/https://github.com/ScoopInstaller/Extras.git" \
  "$USERPROFILE/scoop/buckets/extras"
```

克隆后 remote 已指向镜像，`scoop bucket update extras` 后续可用。

> 如何确认某个应用在哪个 bucket：本机 raw 域名可达时直接 curl 探测
> `https://raw.githubusercontent.com/ScoopInstaller/<Bucket>/master/bucket/<app>.json`，200 即命中。

---

## 六、核心技巧：缓存预置（绕过一切下载封锁）

这是本次最有复用价值的一招。**Scoop 下载前会先查缓存，命中就完全跳过网络请求**——所以只要手动把文件放进缓存目录、起对名字，就能让任何"下载源被墙"的应用正常安装。

### 6.1 缓存文件命名规则

缓存目录：`~\scoop\cache`。Scoop 0.5.x 的 `cache_path` 逻辑（`lib\core.ps1`）：

1. **legacy 格式**：`<app>#<version>#<underscoredUrl>`，其中 `underscoredUrl = url -replace '[^\w\.\-]+', '_'`（连续特殊字符合并为单个下划线，如 `://` → `_`）
2. **该文件存在则直接命中返回**；不存在才走新格式（需要 `Get-FileHash`，本机坏）

两个要点：

- `$url` 是清单里的**原始 URL，含 `#/xxx` fragment**，fragment 也参与下划线化
- 生成 legacy 名字文件可**顺带规避本机 `Get-FileHash` 损坏**的问题

等价 bash 命名公式：

```bash
underscored=$(echo "$url" | sed -E 's/[^A-Za-z0-9_.-]+/_/g')
cachename="<app>#<version>#$underscored"
```

### 6.2 完整流程（以微信为例）

```bash
# 1. 从清单拿 URL / 版本 / 官方哈希
url="https://github.com/cscnk52/wechat-windows-versions/releases/download/v4.1.13.12/weixin_4.1.13.12.exe#/dl.7z"
version="4.1.13.12"
expected="74570be9fa1dbabf11a901e00e24279e139ade7277da4c8852d60faa6403345e"

# 2. 算缓存文件名
underscored=$(echo "$url" | sed -E 's/[^A-Za-z0-9_.-]+/_/g')
target="$USERPROFILE/scoop/cache/wechat#$version#$underscored"

# 3. 通过镜像下载（-C - 断点续传，大文件必备；镜像限速/断流时反复续传即可）
curl -L --fail --retry 5 -C - -o "$target" \
  "https://gh-proxy.com/https://github.com/cscnk52/wechat-windows-versions/releases/download/v4.1.13.12/weixin_4.1.13.12.exe"

# 4. 手动校验哈希（替代损坏的 Get-FileHash，一步都不能省）
sha256sum "$target"   # 必须与清单 hash 一致

# 5. 安装：--skip-hash-check 跳过 Scoop 内置校验（已由第 4 步人工兜底）
scoop install wechat --skip-hash-check
```

微信 241MB 实际耗时参考：`gh-proxy.org` 10 分钟仅 15MB → 换 `gh-proxy.com` 续传，两段共约 20 分钟。**镜像不行就换镜像续传，别从头再来。**

### 6.3 同法安装的 7zip

Scoop 的 7zip 应用（微信解压依赖它）下载源也是 GitHub，同样预缓存：

```bash
# 64 位 MSI：https://github.com/ip7z/7zip/releases/download/26.02/7z2602-x64.msi
# 官方哈希：db407a4f6d4999e5c7bc00ce8a882be94717b56e7fa68140fe3f12605d91643e
scoop install 7zip --skip-hash-check
```

---

## 七、微信清单要点（避免误判为 bug）

`extras/bucket/wechat.json` 有两个容易看懵的点，记录一下分析结论：

1. **URL fragment 是 `#/dl.7z`，安装脚本却解压 `install.7z`——不是 bug**：
   Scoop 核心先按 fragment 后缀识别 7z 自动解压外层（`Invoke-Extraction` → `Expand-7zipArchive -Removal`），微信 4.x 安装包外层解压后才产出内层 `install.7z`，installer script 再做二次解压。两步衔接是自洽的。
2. **数据持久化**：`"persist": "xwechat_files"`，聊天记录/文件落在 `~\scoop\persist\wechat\xwechat_files`，卸载重装不丢。
3. 安装时会写注册表 `HKCU:Software\Tencent\Wexin`（微信官方键名就带这个 typo，非清单笔误）。

---

## 八、踩坑清单 & 经验沉淀

| # | 坑 | 现象 | 解法 |
|---|----|------|------|
| 1 | 官方安装命令直连失败 | `irm get.scoop.sh \| iex` TLS 错误 | 下载脚本 + sed 替换为镜像地址再执行 |
| 2 | PowerShell Security 模块损坏 | `Get-ExecutionPolicy` 加载失败 | 给检查加 `Get-Command` 存在性前置判断 |
| 3 | `Get-FileHash` 缺失 | 哈希校验必崩 | 缓存命名走 legacy 格式避开 + `sha256sum` 手动校验 + `--skip-hash-check` |
| 4 | `scoop install --skip` 不存在 | 0.5.3 参数已改名 | 用 `--skip-hash-check` |
| 5 | extras bucket 巨大 | 完整克隆慢 | `--depth 1` 浅克隆到 `~\scoop\buckets\<name>` |
| 6 | 镜像速度天差地别 | 同文件 26KB/s vs 1.4MB/s | 先测速再下载；`-C -` 断点续传跨镜像续命 |
| 7 | PowerShell 中文乱码输出 | 报错全是 `???` | 认错误码/行号定位，别纠结文案 |

**通用经验**：

- 排障顺序：先测连通性（`curl -w "%{http_code}"`）→ 再定位是域名级封锁还是 TLS 问题 → 最后决定镜像/代理方案。别上来就猜。
- Scoop 安装器源码在本地 `~\scoop\apps\scoop\current\lib\`，**一切行为不确定直接读源码**（本次读了 `core.ps1` 缓存命名、`download.ps1` 下载与校验、`decompress.ps1` 解压流水线，全部得到确认）。
- 跳过校验 ≠ 放弃校验：`--skip-hash-check` 的前提是自己用 `sha256sum` 验过。

---

## 九、遗留事项

1. **修复 PowerShell**（病根）：管理员 `sfc /scannow`，必要时 `DISM /Online /Cleanup-Image /RestoreHealth`。修好 `Get-FileHash` 后，以后安装无需 `--skip-hash-check`。
2. **微信未来升级**：新版 exe 仍从 GitHub 下载，届时重复第六节"缓存预置"流程即可（`scoop bucket update extras` 本身没问题，remote 已是镜像）。
3. 微信新版本号与哈希获取入口：清单内 `checkver.github` 指向 `github.com/cscnk52/wechat-windows-versions`。
