---
title: "软件工程与 GenAI 的八大迷思"
date: 2026-08-08
description: "ACM Queue 文章翻译整理：剖析软件工程与生成式 AI 最常见的八大误区，基于微软及多家机构的实证研究"
---

# Eight Myths on Software Engineering and GenAI

> **原文**: [ACM Queue](https://queue.acm.org/detail.cfm?id=3807963)
> **副标题**: Examining the most common misconceptions
> **作者**: Jenna Butler, Brian Houck, Margaret-Anne Storey, Travis Lowdermilk, Steven Clarke, and Emerson Murphy-Hill

## 摘要

Generative AI is reshaping software engineering—but the narrative has gotten ahead of the evidence. Marketing claims, anecdotal wins, and misread studies have given rise to a set of persistent myths that are quietly driving poor decisions about AI adoption, tooling, and how to measure success.

This article examines eight of the most common misconceptions. We already know developers don't actually spend most of their time writing code, with studies at Microsoft and elsewhere showing it's closer to 14 percent. That means AI code generation, even when it works well, touches a surprisingly small slice of the actual job. And yet organizations are doubling down on lines-of-code metrics to track AI's impact, which is a measure that is neither statistically valid nor meaningfully connected to outcomes such as software quality or delivery speed.

The reality is messier and more interesting than the headlines suggest. AI works better for some tasks, some developers, and some contexts than others. Productivity gains don't flow automatically from handing engineers a license—they require rethinking workflows at the organizational level. Adoption stalls when developers don't trust the tools, lack time to learn them, or worry about de-skilling. And the "startups move fast with AI" narrative ignores the compliance, legacy systems, and reliability constraints that define enterprise software.

This article isn't skeptical, but rather provides practitioners, team leads, and engineering leaders a clearer, research-backed picture so the decisions organizations make about AI are grounded in evidence, not just enthusiasm.

## 引言

Generative AI is transforming software engineering at a pace that has outstripped both empirical research and organizational practice. In this rapidly evolving landscape, myths and misconceptions are often amplified by marketing claims, anecdotal success stories, and misinterpreted studies. Drawing on recent large-scale studies, interviews, and field observations, this article highlights eight of the most persistent myths about AI in software engineering, unpacking the evidence behind each one. The goal is to provide a clear, research-backed foundation for understanding AI's real impact so organizations can make informed decisions about adoption, measurement, and investment.

## Myth 1: Developers Spend Most of Their Time Writing Code

Software engineering is a highly demanding job that involves creativity, long periods of focus, much collaboration—and, surprisingly, relatively little time actually writing code. Software isn't written in a vacuum and, as such, developers need both to spend time independently writing code and in group activities such as meetings, standups, planning, and code reviews. Multiple research projects have looked at how developers spend their days and their time—and the results clearly show that developers don't spend most of their time coding.

A study of more than 450 engineers at Microsoft in 2025 showed developers spend only 14 percent of their time writing code,<sup>[11](#references)</sup> reflecting what has been found in studies over the years.<sup>[13](#references),[14](#references)</sup> One of these studies found that on a "good" workday, engineers spent 18 percent of their time "coding" (not including bug fixing, testing, etc.), while on a "bad" workday, only 11 percent of time was spent coding.<sup>[13](#references)</sup> This highlights how slim the margins can be between a good and a bad day.

A June 2025 study of Microsoft developers looked at their use of AI, and one developer brought up this very point:

> "For me, at my level, I do spend a lot of time on design. So like coding is [one] aspect, but a lot of time is also spent on design and meetings."
>
> "I think that and where it's hard to say, like, I think there's kind of upper bound on how much of my job I could use it for… And the actual, like, amount of time spent coding… feels relatively small in a week."

## Myth 2: Writing Code Is the Bottleneck

Given the above time distribution, using generative AI solely to assist in writing code addresses only a small fraction of the software engineering workload. If developers spend only about 15 percent of their time typing in the editor, then even an AI assist that makes coding twice as fast would, in theory, improve developers' overall productivity by less than 15 percent. The other 85 percent of their time remains untouched.

Accelerating code creation without addressing surrounding tasks (such as design work, understanding legacy code, setting up environments, etc.) can have unintended consequences. If AI enables developers to churn out code faster, it can simply move the pressure downstream. For example, producing more code quickly means more code that needs to be reviewed, tested, and integrated into the product.

The overall development cycle is only as fast as its slowest phase, and coding is often not the slowest phase. Therefore, using AI primarily as a code generator—while helpful for individuals—is not necessarily the best way to use AI to ship software faster. It tackles the "inner loop" of writing code in the IDE but leaves the "outer loop" of development largely unchanged. The same developer said:

> "So in that sense, like I feel like the number of points in my job work that are even touched by GitHub Copilot are relatively small."

## Myth 3: Lines of Code Written by AI Is the Best Measure of Impact

> "Measuring software productivity by lines of code is like measuring progress on an airplane by how much it weighs." —Bill Gates

In 2014, "A statistical study of the relevance of lines of code measures in software projects," was published, the abstract of which concludes with "We find that it [lines of code] fails to meet the specified validity tests and, therefore, has limited utility."<sup>[2](#references)</sup>

Despite this decade-old research, many organizations still rely on lines of code as a measure of developer productivity. With the rise of AI, this metric has evolved into tracking the number of AI-generated lines of code—a figure that has even been reported publicly by companies including Microsoft. Lines of code (and other single-point metrics such as story points), however, are neither statistically valid nor meaningful indicators of impact.<sup>[2](#references),[7](#references),[10](#references)</sup>

Worse, these metrics often incentivize teams to "game" the system, making it harder to assess real outcomes. In unhealthy organizational cultures, such measures can foster toxic behaviors and erode developer trust. When developers feel pressured to prioritize coding volume over collaboration, they may compromise on design quality, leading to increased technical debt and heightened security vulnerabilities.

Ironically, efforts to improve coding velocity—such as through AI-assisted code generation—can amplify longstanding challenges in software engineering. As developers produce more code, the volume of work requiring review, testing, and maintenance also grows, increasing the risk of technical debt. Software engineering companies do not have a goal to maximize the amount of code written, and the evaluation of AI's impact on software engineering should reflect that. Measuring success by code volume alone misrepresents the true objective: delivering secure, maintainable, and high-quality software.

## Myth 4: AI Helps All Tasks and Engineers Equally

Research on GenAI development tools has found mixed results—while many studies find large productivity gains,<sup>[5](#references),[19](#references),[22](#references)</sup> others see neutral effects,<sup>[4](#references),[21](#references)</sup> and recently one even found a negative effect on productivity.<sup>[3](#references)</sup> Why the discrepant results? Right now, we are using AI as a hammer and treating code as a nail, but the evidence suggests many things impact whether GenAI will be successful for a particular coding task—from the nature of the task itself to the skills of the developer.<sup>[6](#references),[9](#references),[17](#references)</sup>

The 2024 Microsoft Report on AI and Productivity Research found that tasks that are familiar and well understood result in larger efficiency gains when using Copilot compared with tasks that are unfamiliar and less understood. The report also found that software development experience and AI assistance experience can positively influence the impact of Copilot usage.<sup>[6](#references)</sup>

Also in the report, problem-solving styles and motivation were shown to impact the success of Github Copilot code generation. Developers who use a comprehensive approach for information processing are more confident in generating successful prompts. In addition, those who feel personally motivated to use technology (as opposed to being forced to) are more confident in generating prompts. Additionally, years of professional software development experience is inversely correlated with confidence in writing effective prompts.<sup>[8](#references)</sup>

When looking at experienced developers in the open source world, a 2025 study found that AI tools actually increased implementation time by 18 percent on average.<sup>[3](#references)</sup> In addition, studies have found that GenAI is more effective for "code-intensive" tasks such as boilerplate and repetitive work, but not for more creative or collaborative tasks.<sup>[4](#references),[20](#references)</sup> Additionally, even how a prompt is crafted can greatly impact the success of using GenAI for coding tasks. One study found that rewriting the prompt but keeping it semantically equivalent led to different code in 46 percent of cases and a change in correctness in 28 percent.<sup>[12](#references)</sup>

GenAI can offer substantial benefits for software engineering, but its effectiveness depends on a complex interplay of factors. Task characteristics, developer experience, familiarity with the codebase, confidence, and prompt-crafting skills all shape outcomes. In short, success with GenAI is highly context dependent—there is no universal formula for making it effective.

## Myth 5: AI Will Turn Individual Developers into 10x Developers

One of the most persistent myths in the discourse around AI and software engineering is that AI tools—such as GitHub Copilot—will transform individual developers into "10x developers," dramatically multiplying their productivity.

As mentioned previously, however, this narrative overlooks the collaborative and interconnected nature of real-world software development and the complexity of real-world coding tasks (many prior studies looked at toy examples and not real-world code). While controlled studies may show impressive productivity gains for individuals working on isolated tasks, these results rarely translate directly to the complex, team-based environments where most software is built. The "55 percent productivity gain"<sup>[19](#references)</sup> is context dependent. Productivity gains measured in isolation do not account for the coordination, collaboration, and knowledge sharing that are essential to successful software delivery.

As has been reported elsewhere,<sup>[17](#references)</sup> much of the difference in performance among developers is attributable to the task they are performing. While one developer might perform better than another on one task, that doesn't mean they consistently perform better on all tasks. This suggests that (as argued throughout this article) task characteristics, context, and fit play a huge role in performance.

## Myth 6: It's Up to Each Developer to Make AI Work

Currently, most studies of AI and software engineering look at how an individual engineer is augmented with a GenAI tool.<sup>[4](#references),[5](#references),[18](#references)</sup> This places the burden of improved productivity from GenAI on the engineers themselves. Historically, gains in productivity have come not from changes at the individual level but from systematic changes at the organization level.

Stated best in his New Yorker article, Cal Newport, professor of computer science at Georgetown University, explains: "Historically, optimizing systems to increase productivity was exceedingly difficult. The assembly line didn't arrive in a flash of self-evident insight. Ford suffered through numerous false starts and incremental experiments. He had to invest significant amounts of money and develop new tools… Now we casually ask individual knowledge workers to undertake similarly complex optimizations of their own proverbial factories, and to do it concurrently with all the work they're attempting to streamline."<sup>[16](#references)</sup>

These tools were often introduced to engineers with minimal guidance. GenAI may be one of the first technologies where organizations have invested millions in licenses without a clear understanding of how to maximize its value. Use cases are emerging organically from the ground up while researchers work to identify best practices. The absence of the dramatic productivity gains many expected suggests that access alone is not enough. To fully realize the potential of GenAI, we need to rethink the systems and processes of software engineering at an organizational level—creating environments where developers can achieve greater impact within a more productive ecosystem.

## Myth 7: High-Performing AI Tools Will Be Adopted Automatically

The assumption that software engineers will adopt AI tools simply because they improve their performance overlooks a complex web of social, organizational, and cognitive barriers. Recent research shows that developers—especially women and older engineers—face a "competence penalty" when using AI, receiving harsher evaluations for AI-assisted work even when the output is identical.<sup>[1](#references)</sup> Trust is also an issue: while 80 percent of developers use these tools, only 29 percent trust their accuracy, and many report spending more time debugging AI output than writing code themselves.<sup>[20](#references)</sup> This undermines the promised productivity gains and adds cognitive load.

Moreover, AI tools often don't integrate smoothly into existing workflows. Developers are already stretched thin and may lack the time or organizational support to learn new tools, especially when those tools don't address their actual pain points. Ethical concerns—ranging from environmental impact to training data provenance—also play a role, as does fear of de-skilling or job displacement.<sup>[4](#references),[15](#references)</sup> Engineers worry that overreliance on AI could erode their problem-solving abilities and make them less indispensable. Ultimately, adoption is not just about tool quality—it's about trust, context, and the human experience of work.

## Myth 8: With GenAI, Enterprises Can Innovate at Startup Speed

Generative AI has led to a common assumption: if a small startup can ship features rapidly, why can't a large enterprise do the same? While AI accelerates development across the board, structural differences between startups and enterprises make this comparison misleading.

Startups typically build on open-source components and widely documented frameworks—resources that were heavily represented in the training data for large language models. Enterprise systems, by contrast, rely on proprietary tools and legacy codebases that AI models have never seen. Beyond technical complexity, enterprises operate under compliance, security, privacy, and regulatory requirements that apply only at scale—constraints most startups never encounter.

GenAI also performs best in greenfield scenarios, yet enterprise software must maintain backward compatibility and integrate seamlessly with thousands of internal systems and third-party tools. The goals differ as well: startups prioritize speed to MVP and rapid iteration, while enterprises balance velocity with reliability, security, and contractual obligations.

Customer expectations further diverge. Startups can release alpha versions with bugs and receive tolerance from early adopters. Enterprise customers expect polished, production-ready solutions—and regulatory and contractual frameworks demand it. AI can help both startups and enterprises move faster, but structural realities mean they will never operate under the same conditions. Speed is visible; complexity is not.

## Conclusion

The myths explored in this document reveal just how complex the impact of generative AI is on software engineering. While AI tools can accelerate certain tasks, their benefits are often overstated or misunderstood—especially when it comes to how developers actually spend their time, what productivity means, and how improvements in one part of the workflow can create new challenges elsewhere. The evidence shows that context matters: Task type, developer experience, team dynamics, and organizational systems all shape the outcomes of AI adoption. Lines of code and speed alone are poor proxies for real progress. Ultimately, realizing the full value of AI in software engineering requires moving beyond hype and simplistic metrics and instead focusing on the broader goals of building secure, maintainable, and high-quality software.

## Related Material

- [Generative AI at the Edge: Challenges and Opportunities](https://queue.acm.org/detail.cfm?id=3733702) — The next phase in AI deployment — Vijay Janapa Reddi
- [On the Evolution of Program State](https://queue.acm.org/detail.cfm?id=3799737) — Larger-scoped forces shaping software engineering safety — Paul Vixie
- [AI: It's All About Inference Now](https://queue.acm.org/detail.cfm?id=3733701) — Model inference has become the critical driver for model performance — Michael Gschwind

## 作者简介

### Jenna Butler

Jenna Butler is a principal applied research scientist at Microsoft, where she studies developer productivity and well-being within engineering organizations and co-leads Microsoft's New Future of Work research program. Her work focuses on the human dimensions of software engineering, including individual and team well-being, decision-making processes, and the social and organizational dynamics of engineering teams. She received her Ph.D. in computer science from Western University in 2015, where her research examined cancer simulation using cellular automata, reflecting an early interest in interdisciplinary approaches bridging computing and the life sciences. Her recent research spans human-computer interaction and socio-technical systems, with contributions to studies on remote and hybrid work, developer experience, and the impact of AI tools in real-world software development.

### Brian Houck

Brian Houck is an applied scientist on Microsoft's Engineering Thrive team. His work combines large-scale telemetry analysis, field experiments, surveys, and qualitative research to uncover the technical, cultural, environmental, and organizational factors that shape developer productivity and well-being. He is best known for his work on the SPACE framework for developer productivity and for his work measuring and improving developer experience in large engineering organizations.

### Margaret-Anne Storey

Margaret-Anne Storey is a professor of computer science at the University of Victoria and a Canada research chair in human and social aspects of software engineering. She is co-author of the SPACE framework and a leading researcher in Developer Experience (DevEx). Her research focuses on how developers and teams understand complex software systems and how tools, AI, and collaborative practices shape that understanding. Her recent work examines how generative AI is transforming software engineering by changing how understanding is created, shared, and maintained. She collaborates with industry partners including Microsoft and DX. She holds an honorary doctorate from Lund University.

### Travis Lowdermilk

Travis Lowdermilk is a mixed-methods UX researcher and author. He works on the CoreAI Design and Research team, empowering anyone, on any platform, to get the most out of AI. He holds a B.S. in information systems from California State University, Fresno, and an M.S. in human-computer interaction from DePaul University. His background is a unique blend of systems thinking, human factors, user research, design, and engineering.

### Steven Clarke

Steven Clarke is a principal UX researcher at Microsoft, where he focuses on the design and evaluation of AI-assisted developer tools. His work focuses on understanding how software developers and engineering organizations adopt agentic AI systems, including how these tools reshape workflows, decision-making, and notions of productivity and quality. He specializes in mixed-methods research, with a particular emphasis on developer experience in complex, enterprise-scale environments.

### Emerson Murphy-Hill

Emerson Murphy-Hill is a research scientist at Microsoft, where he has studied developer experience and helped build Excel Agent. Previously, he was a research scientist in engineering productivity research at Google, leading efforts to improve diversity and inclusion for software developers. Before Google, he was an associate professor at North Carolina State University and led the Developer Liberation Front. His research spans human-computer interaction and software engineering, earning seven ACM SIGSOFT Distinguished Paper Awards, an NSF CAREER Award, a VL/HCC Best Paper Award, and a Microsoft Software Engineering Innovation Foundation Award.

## References

1. Acar, O. et al. Competence penalty is a barrier to the adoption of new technology. 2025; https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5255039.
2. Barb, A. et al. A statistical study of the relevance of lines of code measures in software projects. Innovations in Systems and Software Engineering 10, 4 2014, 243–260; https://dl.acm.org/doi/abs/10.1007/s11334-014-0231-5.
3. Becker, J. et al. Measuring the impact of early-2025 AI on experienced open-source developer productivity. arXiv 2507.09089. 2025; https://arxiv.org/abs/2507.09089.
4. Butler, J. et al. Dear Diary: A randomized controlled trial of Generative AI coding tools in the workplace. In IEEE/ACM 47th Intern. Conf. on Software Engineering: Software Engineering in Practice, 2024, 319–329; https://dl.acm.org/doi/10.1109/ICSE-SEIP66354.2025.00034.
5. Cavalcante, S., Ribeiro, E., and Oran, A. C. The impact of AI tools on software development: a case study with GitHub Copilot and other AI assistants. In Proceedings of the 27th Intern. Conf. on Enterprise Information Systems 2, 2025, 245–252; https://www.scitepress.org/Papers/2025/132947/132947.pdf.
6. Clarke, S. and Hanrahan, B. Comparing the effect on different task types on effective use of Copilot. In Generative AI in Real-World Workplaces: The Second Microsoft Report on AI and Productivity Research, ed. S. Jaffe et al. Microsoft, 2024; https://www.microsoft.com/en-us/research/wp-content/uploads/2024/07/Generative-AI-in-Real-World-Workplaces.pdf.
7. Forsgren, N. et al. The SPACE of developer productivity: there's more to it than you think. acmqueue 19, 1 2021; https://queue.acm.org/detail.cfm?id=3454124.
8. Hanrahan, B. and Clarke, S. Problem-solving styles and confidence generating prompts for GitHub Copilot. In Generative AI in Real-World Workplaces: The Second Microsoft Report on AI and Productivity Research, ed. S. Jaffe et al. Microsoft. 2024; https://www.microsoft.com/en-us/research/wp-content/uploads/2024/07/Generative-AI-in-Real-World-Workplaces.pdf.
9. Houck, B. et al. The SPACE of AI: real-world lessons on AI's impact on developers. arXiv 2508.00178. 2025; https://arxiv.org/abs/2508.00178.
10. Jaspan, C. and Sadowski, C. No single metric captures productivity. In Rethinking Productivity in Software Engineering, ed. C. Sadowski and T. Zimmermann, Apress: Berkeley, CA 2019, 13–20; https://link.springer.com/chapter/10.1007/978-1-4842-4221-6_2.
11. Kumar, S. et al. Time warp: the gap between developers' ideal vs actual workweeks in an AI-driven era. Microsoft 2025; https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Time-Warp-Developer-Productivity-Study.pdf.
12. Mastropaolo, A. et al. On the robustness of code generation techniques: an empirical study on GitHub Copilot. In Proceedings of the 45th Intern. Conf. on software Engineering, 2023, 2149–2160; https://dl.acm.org/doi/abs/10.1109/ICSE48619.2023.00181.
13. Meyer, A.N. et al. Today was a good day: the daily life of software developers. IEEE Transactions on Software Engineering 47, 5 2019, 863–880; https://ieeexplore.ieee.org/document/8666786.
14. Meyer, A.N. et al. The work life of developers: activities, switches and perceived productivity. IEEE Transactions on Software Engineering 43, 12 2017, 1178–1193; https://dl.acm.org/doi/10.1109/TSE.2017.2656886.
15. Miller, C. et al. "Maybe we need some more examples:" individual and team drivers of developer GenAI tool use. arXiv 2507.21280v1. 2026; https://arxiv.org/html/2507.21280v1.
16. Newport, C. The frustration with productivity culture. The New Yorker (September 13); https://www.newyorker.com/culture/office-space/the-frustration-with-productivity-culture.
17. Nichols, W. R. The end of the myth of individual programmer productivity. IEEE Software 36, 5 2019, 71–75; https://ieeexplore.ieee.org/document/8804291.
18. Peng, S. et al. The impact of AI on developer productivity: evidence from GitHub Copilot. arXiv 2302.06590. 2023; https://arxiv.org/abs/2302.06590.
19. Pereira, G. et al. Exploring GenAI in software development: insights from a case study in a large Brazilian company. In IEEE/ACM 47th Intern. Conf. on Software Engineering: Software Engineering in Practice, 2025, 330–341; https://dl.acm.org/doi/abs/10.1109/ICSE-SEIP66354.2025.00035.
20. Stack Overflow. Developers remain willing but reluctant to use AI: The 2025 Developer Survey results are here. (July 29). https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/.
21. Vaithilingam, P., Zhang, T., and Glassman, E. L. Expectations vs experience: evaluating the usability of code generation tools powered by large language models. In CHI Conf. on Human Factors in Computing Systems Extended Abstracts, 332, 2022, 1–7; https://dl.acm.org/doi/10.1145/3491101.3519665.
22. Zheyuan, K. et al. The productivity effects of generative AI: evidence from a field experiment with GitHub Copilot. An MIT Exploration of Generative AI. 2024; https://mit-genai.pubpub.org/pub/v5iixksv/release/2.

---

**版权信息**: Copyright © 2026 held by owner/author. Publication rights licensed to ACM. This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivs International 4.0 License.

**来源**: acmqueue — Originally published in Queue vol. 24, no. 2
