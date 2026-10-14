---
title: "记一次 git clone 从权限报错到网络问题突围"
date: 2026-08-30
description: "Windows 11 上配置 Git SSH 的完整排查记录：公钥配置、端口封锁、权限僵局，三个回合的实战经验"
---

# 记一次 Windows SSH 配置"战役"：从权限报错到网络突围

> 最近在 Windows 11 上配置 Git SSH 时，我遭遇了一连串看似"无解"的报错。从公钥权限被拒，到连接被远程关闭，再到配置文件被系统锁定无法修改。这篇文章记录了我解决问题的完整思路、核心原理和实用技巧，希望能帮你少走弯路。

---

## ⚔️ 第一回合：公钥配置

### 报错信息

```
Permission denied (publickey)
```

复制了 `id_rsa.pub`，也添加到了 GitHub，但还是报错。

### 问题根源

GitHub 不认识我电脑的身份 —— **公钥没有正确关联**。

### 关键操作

**1. 检查公钥格式**

确保将**完整的公钥**（以 `ssh-rsa` 开头）添加到 GitHub 账户的 SSH Keys 设置中：

```bash
# 查看公钥内容
cat ~/.ssh/id_rsa.pub
```

> 小贴士：可以去掉末尾的邮箱注释，不影响功能。

**2. 测试连接**

在 Git Bash 中执行以下命令进行调试：

```bash
ssh -T git@github.com
```

如果成功，你会看到：

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### 经验总结

公钥认证的原理是 **"匹配密钥对"**：

- **私钥**：留在本地（`~/.ssh/id_rsa`），绝不外泄
- **公钥**：放在远程（GitHub SSH Keys 设置）

`ssh -T` 是验证连接最直接有效的命令。

---

## 🚧 第二回合：网络封锁

### 报错信息

```
Connection closed by 172.182.252.133 port 22
```

公钥明明是对的，连接却被瞬间切断。

### 问题根源

**网络防火墙屏蔽了 SSH 默认的 22 端口** —— 在公司网络或公共 Wi-Fi 中很常见。

### 关键操作

通过配置 SSH 客户端，让连接走 **HTTPS 的 443 端口**（通常不会被屏蔽）。

**核心配置文件**：`~/.ssh/config`

> Windows 下路径：`C:\Users\你的用户名\.ssh\config`（无后缀）

**关键配置内容**：

```text
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
```

### 经验总结

SSH 连接**不一定非要用 22 端口**。GitHub 官方提供了 443 端口的支持，这是解决网络封锁问题的关键。

```bash
# 验证 443 端口连接
ssh -T -p 443 git@ssh.github.com
```

---

## 🔐 第三回合：权限僵局

### 问题描述

修改 `~/.ssh/config` 文件时，Windows 提示：

- "权限不足"
- "文件访问被拒绝"

即使以**管理员身份**打开记事本，也无法直接保存。

### 问题根源

`.ssh` 文件夹及内部的配置文件，**默认所有者可能是 SYSTEM 或之前的用户**，当前账户只有读取权限。

### 创新解法（迂回战术）

当直接修改受阻时，采用 **"复制→编辑→覆盖"** 的迂回战术：

**Step 1：复制文件到桌面**

```powershell
# 将 config 复制到桌面
copy C:\Users\你的用户名\.ssh\config C:\Users\你的用户名\Desktop\config.copy
```

**Step 2：管理员编辑**

以**管理员身份**运行记事本，打开桌面的 `config.copy` 进行修改并保存。

**Step 3：备份原文件**

```powershell
# 回到 .ssh 文件夹，备份原文件
cd C:\Users\你的用户名\.ssh
ren config config.backup
```

**Step 4：覆盖原文件**

```powershell
# 将修改好的文件复制回 .ssh 目录
copy C:\Users\你的用户名\Desktop\config.copy C:\Users\你的用户名\.ssh\config
```

### 经验总结

当系统权限复杂导致无法直接修改时，通过 **"复制→管理员编辑→重命名覆盖"** 的方式，可以优雅地绕过权限检查，且不影响最终结果。

> 💡 进阶技巧：如果经常遇到权限问题，可以修改 `.ssh` 文件夹的所有者：
>
> ```powershell
> # 右键 .ssh 文件夹 → 属性 → 安全 → 高级 → 更改所有者
> # 将所有者改为当前用户，并勾选"替换子容器和对象的所有者"
> ```

---

## 💎 最终战果

配置好 `config` 文件后，再次执行：

```bash
ssh -T git@github.com
```

熟悉的欢迎信息出现了：

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

至此，所有障碍都被扫清，Git 仓库可以正常克隆和推送。

---

##  核心心得

在技术排查中，**读懂报错信息背后的潜台词**比盲目尝试更重要：

| 报错关键词 | 可能原因 | 排查方向 |
|:---|:---|:---|
| `Permission denied` | 公钥未配置/格式错误 | 检查 GitHub SSH Keys 设置 |
| `Connection closed` | 网络/端口问题 | 尝试 443 端口 |
| `文件访问被拒绝` | 文件权限问题 | 检查文件所有者/使用迂回战术 |

希望这篇实战记录能成为你排查 SSH 问题时的一份参考索引。

---

## 🔗 相关资源

- [GitHub SSH 官方文档](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Testing your SSH connection](https://docs.github.com/en/authentication/troubleshooting-ssh/testing-your-ssh-connection)
- [Using SSH over the HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)
