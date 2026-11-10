# Sustainability × Systems × SIGMETRICS：论文选择与讨论手册

基于 Zotero `System → computing_knobs`。读取到 11 篇独立文献；附件和笔记不重复计数。核对日期：2026-11-10。配套逐页英文稿见 `Sustainability_SIGMETRICS_Talk.md`。

## 一、这场报告真正要让对方记住什么

建议题目：**Better Metrics for Sustainable AI Systems: From Efficient Inference to Useful Intelligence under Resource Constraints**。

不要把 20–30 分钟变成 11 篇论文串讲。要让对方听完能回答：

1. Sustainability 为什么会改变我熟悉的系统决策？
2. 除了 energy/carbon，还有什么量值得进入 measurement、objective 或 constraint？
3. 如何把这个量变成 SIGMETRICS 风格的 measurement/model/algorithm/system 贡献？
4. 我们能先用什么小原型验证一个关键假设？

一句话主线：**先证明现有 metric 漏掉了会改变决策的东西，再建立测量或模型，最后用系统机制把这种改变兑现。** 这是本报告的综合框架，不是某一篇论文的原话。

## 二、邮件四个链接分别是什么

| 邮件链接 | 对应论文 | 演讲处理 |
|---|---|---|
| arXiv:2505.23970 | Cache Your Prompt When It's Green（GreenCache） | 核心案例；官方 SIGMETRICS 2026 accepted list 可核验 |
| 10.1145/3801489.3806868 | HealthServe 的 SIGMETRICS 2026 会议摘要 | 讲论文时改用正文 DOI **10.1145/3805638**；两者是同一研究，不计两篇 |
| IEEE 11230830 | Disaggregated Speculative Decoding for Carbon-Efficient LLM Serving（GreenLLM） | IEEE Computer Architecture Letters 2025；不要称其为 SIGMETRICS 论文 |
| arXiv:2609.24639 | Analytical Power-Aware Provisioning for Prefill-Decode Disaggregated AI Inference | 2026 预印本；用来讲 capacity–power 模型，不将它直接等同于 carbon optimization |

核验：[SIGMETRICS accepted papers](https://sigmetrics.org/sigmetrics2026/accepted.html)、[HealthServe 会议摘要](https://doi.org/10.1145/3801489.3806868)、[HealthServe 正文](https://doi.org/10.1145/3805638)、[GreenLLM DOI](https://doi.org/10.1109/LCA.2025.3630094)、[PD provisioning](https://arxiv.org/abs/2609.24639)。会议摘要与正文类型另经 DOI 元数据核对。

## 三、主讲论文：按在故事中的作用排序

### P1. EcoServe: Designing Carbon-Aware AI Inference Systems

**作者：** Yueying Li, Zhanqiu Hu, Esha Choukse, Rodrigo Fonseca, G. Edward Suh, Udit Gupta。**年份：** 2025。**本次核验版本：** arXiv 预印本；不根据 Zotero 的 preprint 类型推断其后续是否已在其他 venue 出版。**Zotero key：** `44JM8JMC`。

**作用：** 背景桥梁，约 1 分钟，放第 2 页。

它把 AI inference 的 operational/embodied carbon 放在一起，考虑异构硬件与 workload，通过 resource provisioning 和 scheduling 做跨层优化。在其研究对象中，GPU operation 与 host components 的 embodied footprint 呈现不同贡献结构。

**要讲的 insight：** 如果只看 GPU joules，可能漏掉容量和设备组合的生命周期代价。

**可追问但未证明的方向：** 现有 fleet 的运行决策和新购硬件决策，应该用什么不同的核算/优化边界？

**避免：** 把特定生产 traces 中的构成比例推广到所有数据中心；把模型分摊结果等同于真实避免制造。

来源：[arXiv](https://arxiv.org/abs/2502.05043)。

### P2. Cache Your Prompt When It's Green: Carbon-Aware Caching for Large Language Model Serving

**作者：** Yuyang Tian, Desen Sun, Yi Ding, Sihang Liu。**年份：** 2025 首次预印本，2026 修订；SIGMETRICS 2026 官方接收列表可核验。**Zotero key：** `RYHUXVUA`。

**作用：** 主案例一，约 2 分钟，第 4 页。建议优先精读。

**问题与 knob：** 缓存 KV 可以避免重复计算，但需要存储资源；论文把 SSD embodied carbon 纳入 cache/resource allocation。其 GreenCache 依据工作负载与延迟约束调整资源。

**新 metric 的示范价值：** hit rate、latency 或 compute energy 的最佳点，不能直接代替论文 carbon model 下的最佳点。

**可引用结果：** Llama-3 70B、法国电网情境下，平均减碳 15.1%，最高 25.3%，超过 90% 请求满足其延迟约束。讲稿只保留这一组数字，务必附场景和 SLO 口径。

**重点看：** §3 performance/carbon tradeoff，§5 framework 和 accounting assumptions，§6 evaluation/sensitivity。

**讨论切口：** cache reuse 的 break-even boundary；资源重分配与新购 SSD 的区别；lifetime/embodied estimates 的敏感性。都是讨论问题，不是已经确认的未解空白。

来源：[正文 v3](https://arxiv.org/html/2505.23970v3)、[接收列表](https://sigmetrics.org/sigmetrics2026/accepted.html)。

### P3. HealthServe: A Public Health-Aware Inference Framework

**作者：** Sicheng Zhou, Rohan Basu Roy。**年份/venue：** 2026，POMACS 10(2), Article 40；SIGMETRICS 2026。**Zotero key：** `C8ERQJV5`。

**作用：** 主案例二，约 2 分钟，第 5 页。建议优先精读。

**问题：** carbon footprint 不包含电力相关污染物的全部局地健康影响。

**metric 链条：** 能耗/电力活动 → pollutant emissions → dispersion/exposure → concentration-response 与货币化估值 → modeled health cost。正文涉及 AVERT、COBRA 和 WattTime 提供的信息。

**系统机制：** 跨地区 routing 与 serving configuration 的层级调度，同时考虑 carbon、health cost 和 latency SLO。slow/fast knobs 的不同重配置时标是值得向 systems faculty 强调的结构。

**讲法：** 一个成功的新 metric 案例，因为它能改变 placement/configuration 决策，并与可控 knobs 对接。

**重点看：** motivation 中 carbon–health 排序不同的案例、health-cost 建模边界、系统架构和 evaluation baselines。

**边界：** health cost 为模型估计，不是实测某条请求造成的病例数；正文承认 AVERT/COBRA 是 screening-level estimates，有模型不确定性。不要把推算的健康收益讲成临床证据。

来源：[正式全文](https://doi.org/10.1145/3805638)；本次读取 Zotero 索引正文。

### P4. WaterWise: Co-optimizing Carbon- and Water-Footprint Toward Environmentally Sustainable Cloud Computing

**作者：** Yankai Jiang, Rohan Basu Roy, Raghavendra Kanakagiri, Devesh Tiwari。**年份/venue：** 2025，PPoPP。**Zotero key：** `5SC5U2BH`。

**作用：** 第 5 页补充 30–45 秒；如果对方关注 data center infrastructure，可多讲。

通过 geographically distributed job scheduling 同时考虑 carbon 和 water，展示两种目标可能冲突。它提供“carbon 不能自动代表所有 environmental impacts”的第二个例子。

**你自己的延伸问题：** 研究对象究竟是用水体积、consumption 还是 withdrawal？是否需要地区 scarcity weighting？这些定义应在下一步精读中逐项核验，不在本次讲稿里冒充 WaterWise 的全部公式。

**边界：** 不是所有地区/时段都 carbon-water 冲突；也不是 SIGMETRICS 主会论文。

来源：[论文](https://arxiv.org/abs/2501.17944)、[正式 DOI](https://doi.org/10.1145/3710848.3710891)。

### P5. Fair, Practical, and Efficient Carbon Accounting for LLM Serving

**作者：** Yueying Lisa Li, Leo Han, G. Edward Suh, Christina Delimitrou, Fiodar Kazhamiaka, Esha Choukse, Rodrigo Fonseca, Liangcheng Yu, Jonathan Mace, Udit Gupta。**年份/类型：** 2025，CarbonMetrics workshop 相关工作，发表于 ACM SIGMETRICS Performance Evaluation Review。**Zotero key：** `II2T5HAU`。

**作用：** 第 6 页，约 2 分钟；最直接体现 metrics 本身也是研究对象。

将 shared LLM serving 的请求、runtime、carbon model 分开，讨论 attribution 的 scalability、fairness、sample efficiency、incentivization。以 Shapley value 为公平分配的参照，并分析 leave-one-out 方法的 efficiency 问题。

**要点：** batching/shared execution 下，按 token 分摊是一个待验证的规则，而非自然真值。这里 efficiency 指合作博弈中的总量分配性质，不能翻译成节能效率。

**建议延伸：** 线上低开销近似、账户对齐与真实行为激励；把“公平分账”与“改变一次行为可避免多少排放”分开。

**重点看：** 问题定义、attribution criteria、Shapley 与 leave-one-out 的比较。

**边界：** 这是一套评估框架，不要讲成已经提出一个全面解决问题的在线算法；不是 POMACS 主会长文。

来源：[正式 DOI](https://doi.org/10.1145/3764944.3764967)；读取 Zotero 正文。作者 [Leo Han 的 CV](https://leoxhan.com/cv/) 将其列作 CarbonMetrics'25 workshop paper。

### P6. Analytical Power-Aware Provisioning for Prefill-Decode Disaggregated AI Inference

**作者：** Mingyuan Yan, Haiyu Wang, Linxuan Biao, H. Jonathan Chao, Sai Qian Zhang, Wenqi Cui。**年份/类型：** 2026，arXiv 预印本。**Zotero key：** `EBT8XHBN`。

**作用：** 第 7 页，约 1 分钟，展示 analytical modeling 路线。

从 input/output length joint distribution、compute/memory limits、queueing、KV reservation coupling 推导 serving capacity，并结合平均 power model 得到 provisioning Pareto frontier。

**要讲的 insight：** 请求长度和 prefill/decode 配比的影响，不能只靠一个平均 throughput 数字表达。

**建议延伸：** 把有限 power budget 下的容量模型接到在线 provisioning；先测模型对新 workload 的预测误差，再考虑环境成本扩展。

**边界：** average power/capacity 不等于瞬时峰值保证；paper 本身不是 lifecycle-carbon/health 优化。不要因其方法契合 SIGMETRICS 就声称已获接收。

来源：[摘要](https://arxiv.org/abs/2609.24639)、[正文](https://arxiv.org/html/2609.24639v1)。

### P7. Disaggregated Speculative Decoding for Carbon-Efficient LLM Serving

**作者：** Tianyao Shi, Yanran Wu, Sihang Liu, Yi Ding。**年份/venue：** 2025，IEEE Computer Architecture Letters 24(2), 369–372。**Zotero key：** `F875E6VE`。

**作用：** 第 7 页，约 1 分钟，把环境目标接到 inference architecture。

提出在 older GPUs 上放 draft、newer GPUs 上放 target 的 disaggregated speculative decoding；其通信方式与 prefill/decode 的大 KV transfer 不同。GreenLLM 在 SLO、bandwidth 与 carbon 之间选择配置，结合两种 disaggregation 方式。

**要讲的 insight：** 不只是调电力系数，执行图、硬件角色和通信流本身都能成为环境优化的设计空间。

**建议追问：** acceptance rate、request mix、network condition 改变时，配置切换的收益能否覆盖开销？

**边界：** 论文报告的“最高 40.6%”是特定实验的最大值；主讲可省略数字。不要把 speculative decoding 讲成必然牺牲输出质量，是否保持分布取决于具体算法与实现。

来源：[DOI](https://doi.org/10.1109/LCA.2025.3630094)、[用户邮件中的 IEEE 链接](https://ieeexplore.ieee.org/document/11230830/)；本次读取 Zotero 正文。

### P8. LLM-PowerTrace: A Dataset of Time-Resolved GPU Power Traces for AI Compute

**作者：** Jiansheng Wang, Jaskeerat Singh, Haochen Xu, Xinyi Li, Mingyuan Yan, Shaohui Liu, Yuzhuo Li, Yize Chen, Wenqi Cui。**年份/类型：** 2026-10-28，预印本，arXiv 标注 In Submission。**Zotero key：** `RR858VID`。

**作用：** 第 8 页，约 1.5 分钟；measurement/dataset 路线。

100 ms 粒度的 GPU power traces，覆盖 fine-tuning 与 inference 的配置扫描；讨论能量以外的动态特性，包括 ramp、regularity、synchronization。

**要讲的 insight：** 相似 joules/token 可能隐藏不同的功率轨迹；必须匹配测量分辨率与结论尺度。

**建议延伸：** 已有动态 characterization 之后，做多 replica coordination 或 admission/power-cap controller，并证明 resource headroom/goodput 的实际改善。

**边界：** 仅“提出 ramp 指标”不够新；不能从 100 ms GPU telemetry 推断更快尺度的电气安全，也不能直接等同设施功率。

来源：[arXiv](https://arxiv.org/abs/2610.38315)；本次读取 Zotero 正文。

## 四、另外三篇：留在备份材料

### P9. Sprout: Green Generative AI with Carbon-Efficient LLM Inference

**作者：** Baolin Li, Yankai Jiang, Vijay Gadepally, Devesh Tiwari。**年份/venue：** 2024，EMNLP。**Zotero key：** `95LBNXIL`。

使用 generation directives、directive assignment optimizer 和 offline quality evaluator，连接生成过程、输出质量与 carbon。适合当对方问“模型行为/输出本身能否成为 knob”时补充。

**与你方向的关系：** 说明 inference-time quality–resource tradeoff 已有先例；不能把“加入 quality-aware metric”一概称为新问题。更清晰的新问题应落在任务成功定义、控制机制、约束或验证方法。

来源：[ACL Anthology](https://aclanthology.org/2024.emnlp-main.1215/)。

### P10. FissionReady: Joint Workload and Power Scheduling for Data Centers Powered by Small Modular Reactors

**作者：** Raghavendra Kanakagiri, Rohan Basu Roy, Yankai Jiang, Pranathi Wuppuluru, Devesh Tiwari。**年份/类型：** 2026，预印本。**Zotero key：** `RBMVZ9HY`。

将 SMR 的运行状态与 flexibility 建模，做工作负载、电力购买与机组运行的双时标协调。适合说明 computing 与能源供给的耦合；本场主体不展开，以免引出大量核电背景。

**避免：** 从 SMR operational emissions 讨论推导“核电生命周期零碳”；也不把论文建模评估称作已部署核能数据中心的运行结果。

来源：[arXiv](https://arxiv.org/abs/2609.39422)。

### P11. Strategies and design for increasing AI sustainability

**作者：** Andrew A. Chien, Udit Gupta, Shaolei Ren, Akshitha Sriraman, Bill Tomlinson。**年份/venue：** 2026，Nature Reviews Clean Technology。**Zotero key：** `YN7FSWNV`。

可作会后 broad reading。本次依据 Zotero 题录列入，未读取正文，不据此总结具体结论或推荐特定图。报告主体优先用已经核验的方法论文。

来源：[DOI](https://doi.org/10.1038/s44359-026-00195-w)。

## 五、SIGMETRICS 的研究地图：对 systems faculty 的说法

官方 CFP 强调 systems design、measurement、modeling 和 performance analysis，同时覆盖 energy/carbon、queueing、scheduling、control、resource allocation 等方向。下面是根据这些范围和所读论文整理的解释，不是官方审稿评分表。

| 路线 | 常见研究问题 | 合适的证据 | 本场例子 |
|---|---|---|---|
| Measurement / characterization | 常用 proxy 漏掉什么？现象有多普遍？ | 仪器校准、重复测量、异构 workloads、可复现数据 | PowerTrace；HealthServe 的动机测量 |
| Analytical modeling | 是什么 coupling 决定 capacity、delay、footprint？ | 明确假设、预测误差、边界条件、模型外验证 | PD provisioning |
| Algorithms / online control | 负载与资源信号不确定时如何决策？ | 分析或界限（如适用）、trace evaluation、控制开销 | 本报告建议的后续路线 |
| Systems / resource management | 哪些 knobs 能兑现收益？怎样跨时标控制？ | 原型、强 baseline、ablation、端到端 SLO | GreenCache、HealthServe |
| Accounting / incentives | 共享 footprint 如何分配？规则鼓励什么行为？ | 公理、复杂度、参考分配误差、行为验证 | Fair Carbon Accounting |

会场不是只研究 sustainability。你应说“这是 SIGMETRICS 中一个活跃且契合其方法的方向”，不要说整个社区都在做 green AI。

官方来源：[SIGMETRICS 2026 CFP](https://sigmetrics.org/sigmetrics2026/call_for_papers.html)。

## 六、如何把一个“新 metric”做成可发表的问题

### 先分三种“新”

1. **加入新的影响维度：** 如 health；需要证明它与既有目标有决策相关差异。
2. **修正既有核算方式：** 如 embodied allocation、shared attribution；需要明确目标公理、总量边界和使用场景。
3. **改变有效工作或时间尺度的定义：** 如 successful-task footprint、power dynamics；需要可复现任务标准和仪器分辨率。

后两类不一定是首次出现的概念。贡献可以来自更合理的测量、模型、算法或系统机制，而不必包装成全新的指标名字。

### 建议的一套最小论证

**现象：** 在相同需求、quality 和 SLO 下，旧 metric 对配置 A/B 的排序，与新增目标不同。

**解释：** 找到排序反转来自哪个具体机制：例如 reuse、memory occupancy、grid signal、shared execution 或 replica synchronization。

**可控性：** 系统有能改变这个量的 knob，且切换开销没有吞掉收益。

**验证：** 在未参与 calibration 的 workloads 上测试，同时报告控制成本、总量、tail latency、rejections 和不确定性。

**收益归因：** 对比“仅换 metric”“仅换 controller”“两者一起”，避免把 baseline 太弱造成的收益讲成 metric 的价值。

### 推荐第一项合作实验（proposal）

固定一个模型与任务集，从 batching、power cap、cache capacity 选 2–3 个 knobs。先测 response surface：throughput、TTFT、TPOT、energy、power dynamics。再选一个新增约束，画出 feasible region 和 Pareto frontier。

优先问题：**在已有 energy-aware controller 上，加入所选约束，是否稳定地改变最优配置，并提高固定资源预算下的 useful goodput？** 如果回答是否定的，也能尽早排除一个无效方向。

如果选 carbon/health/water，需要外部环境数据和明确核算模型；如果选 power dynamics，可先在本地硬件闭环验证。两者不要在第一版里全部叠加。

## 七、邮件中的四位研究者怎样介绍

建议称为“几组值得追踪的相关研究”，不必统称 senior researchers；他们也不只在 SIGMETRICS 发表。

| 研究者 | 本场可用的定位 | 最自然的连接 |
|---|---|---|
| Udit Gupta | 从本文件夹作品看，覆盖 lifecycle carbon、AI serving 和 attribution | EcoServe、Fair Carbon Accounting |
| Mohammad Hajiesmaili | Sustainability、optimization、learning 和 algorithms；本场可连接 online resource decisions | SIGMETRICS 2026 的 Online Smoothed Demand Management、Green Bin Packing |
| Devesh Tiwari | 从本文件夹作品看，覆盖 AI inference 和跨 carbon/water/energy-system 的管理 | Sprout、WaterWise、FissionReady |
| Akshitha Sriraman | sustainable cloud systems 与低碳 server design | 若对方偏 architecture/hardware lifecycle，补 Designing Cloud Servers for Lower Carbon |

以上是交流用的概括，不是完整学术画像。依据：[Hajiesmaili 官方主页条目](https://www.cics.umass.edu/about/directory/mohammad-hajiesmaili)、[SIGMETRICS 2026 接收列表](https://sigmetrics.org/sigmetrics2026/accepted.html)、[Sriraman 官方 faculty 页面](https://csd-web-01.andrew.cmu.edu/people/faculty/akshitha-sriraman) 以及本文件夹作者题录。

## 八、今天时间有限时的准备顺序

1. **GreenCache：** 记住 tradeoff、knob、核算假设和一组带条件的实验结果。
2. **HealthServe：** 记住 environmental signal 如何经过模型进入 routing；能解释为什么 carbon 不足。
3. **Fair Carbon Accounting：** 能区分 attribution、marginal effect 和 Shapley reference。
4. **PD provisioning：** 记住 queueing/KV reservation coupling 和 capacity–power frontier。
5. 快速过 GreenLLM、PowerTrace；EcoServe 作为背景；WaterWise 一句话补充；其他三篇备份。

如果只能带四篇论文进会议，就带第 1–4 项。报告中可以提到其余论文，但不展开方法和结果。

## 九、材料核验范围

读取了 computing_knobs 全部 11 篇的 Zotero 题录与可用摘要；另外读取 HealthServe、Fair Carbon Accounting、GreenLLM、PowerTrace 的 Zotero 索引全文，以及 GreenCache、PD provisioning 的公开正文页面。EcoServe、WaterWise、Sprout、FissionReady 的本次概括主要基于公开摘要；Nature Reviews 条目仅核验到 Zotero 题录。没有将未读全文的内容写成细节结论。

没有修改 Zotero 条目、collection 或附件。Zotero key 是库内定位键，不等于 BibTeX citation key。
