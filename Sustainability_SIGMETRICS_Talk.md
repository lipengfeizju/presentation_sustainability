# Better Metrics for Sustainable AI Systems
## From efficient inference to useful intelligence under resource constraints

准备对象：熟悉 systems、不熟悉 sustainability 的 faculty。英文讲稿，中文演讲提示。根据 Zotero `System → computing_knobs` 的 11 篇论文和公开来源整理，核对日期：2026-11-10。

**中心论点：A sustainability metric becomes a systems contribution when it changes a concrete decision, captures an effect that existing metrics miss, and survives measurement and validation.**

以下是讨论型报告，不是逐篇 literature review。正文英文约适合 20–25 分钟，加图示解释和交流为 25–30 分钟；最终以你的语速彩排为准。文献编号对应同目录 `Sustainability_Paper_Guide.md`。研究设想均标为 proposal，不应说成已完成结果或已经确认的空白。

## 时间与页面安排

| 页 | 标题 | 建议时间 | 目的 |
|---|---|---:|---|
| 1 | What should we optimize as AI scales? | 1.5 min | 对齐 systems 兴趣 |
| 2 | Energy, carbon, and lifecycle boundaries | 2 min | 补最低限度背景 |
| 3 | What SIGMETRICS contributes | 2 min | 解释社区方法与贡献形式 |
| 4 | A familiar knob, a different optimum: GreenCache | 2 min | 主案例一 |
| 5 | Beyond carbon: HealthServe and WaterWise | 2.5 min | 主案例二，新 metric 改变决策 |
| 6 | Who owns the footprint? | 2 min | 共享服务归因 |
| 7 | Power availability and inference architecture | 2 min | 邮件另外两篇，micro 切口 |
| 8 | From average energy to power dynamics | 1.5 min | PowerTrace 的新观测维度 |
| 9 | How to build a useful new metric | 2.5 min | 你的核心观点 |
| 10 | Three research directions | 2.5 min | 把综述转为合作 |
| 11 | A first prototype and evaluation | 2 min | 可执行起点 |
| 12 | Discussion | 0.5 min | 邀请 faculty 参与 |

合计约 23.5 分钟。20 分钟版本：第 6 页缩至 1 分钟，第 8 页缩至 0.5 分钟，第 10 页只讲方向 A。30 分钟版本：正文控制在 24–25 分钟，留下 5 分钟讨论。不要通过增加论文数量填时间。

---

## 1. What should we optimize as AI scales?

**屏幕只放：** latency / throughput / quality → energy / carbon / water / health / power capacity；底部一句：Which additional metric changes the decision?

**Script**

Thanks for taking the time to discuss this. I would like to frame sustainable computing through a systems question: as we scale AI, what should the system optimize, and what information does it need to make that decision?

We already have many useful controls: batching, caching, resource provisioning, power caps, placement, and heterogeneous hardware. These controls are usually evaluated through latency, throughput, cost, or sometimes energy efficiency. Sustainability adds another question: do those measurements capture the consequences we actually care about?

My working hypothesis is that a better metric can reveal a different operating point, and that operating point may require a different system design. So there are two contributions to think about together: defining what matters, and building the mechanism that can act on it.

I will use AI inference as the running example because it connects directly to current serving systems. I will first give the minimum sustainability background, then use a few papers to explain the research style around SIGMETRICS, and finally outline possible projects connecting my macro-level interests with a concrete systems prototype.

**中文提示：** 开头直接讲合作问题。不要先花五分钟讲全球排放数字；这位听众最需要的是“这和我的 systems 研究有什么关系”。

## 2. Energy, carbon, and lifecycle boundaries

**屏幕公式：**

`Operational carbon = Σ(region,time) electricity consumed × carbon intensity`

`Accounted lifecycle carbon = operational carbon + allocated embodied carbon`

单位：kWh、gCO₂e/kWh、gCO₂e。GPU 能量与设施电量需要声明边界；若已经测量设施电量，不再重复乘 PUE。

**Script**

There are two distinctions that will be useful throughout the talk.

First, energy and carbon are different quantities. Energy describes electricity consumption. Operational carbon also depends on how that electricity is generated, and therefore on location and time. Reducing energy is valuable, but comparing two deployments requires knowing both their electricity use and the relevant carbon intensity.

Second, computing has a lifecycle. Running the hardware consumes electricity, while manufacturing the hardware also creates emissions. We call these operational and embodied carbon. Once embodied carbon is included, resource capacity, hardware lifetime, and replacement decisions enter the problem.

This is why I find EcoServe useful as background. In its studied deployments, GPU operation and the manufacturing footprint of host components play different roles. Its broader message is to reason across provisioning and scheduling, rather than measuring only accelerator electricity. [P1]

There is an accounting subtlety here. If an existing device has already been manufactured, assigning part of that manufacturing footprint to a request is an accounting convention. It does not mean that deleting the request reverses manufacturing emissions. For runtime control, procurement, and reporting, we may need different views of the same system.

For our discussion, I would always state the measurement boundary and the decision horizon. Are we controlling an existing fleet over minutes, or deciding what hardware to buy over years? The answer affects which metric is useful.

**中文提示：** 这页只教两个概念。Embodied carbon 的“分摊”与“真实新增排放”区别很重要，避免后面把 accounting reduction 都讲成物理减排。

来源：[EcoServe](https://arxiv.org/abs/2502.05043)；概念与核算边界讨论为本讲稿的综合说明。

## 3. What SIGMETRICS contributes

**屏幕流程：** observation → measurement/model → principled decision → validation。

**Script**

What does SIGMETRICS bring to this problem? The official scope combines systems design with measurement, modeling, and performance analysis. It explicitly includes metrics such as latency, throughput, fairness, energy, and carbon footprint. Its conference papers are associated with POMACS. [S1]

My interpretation of that research style is that a convincing sustainability paper needs an explanatory chain. We observe a phenomenon, measure or model it, use that understanding to make a decision, and validate the result.

There are several possible entry points. A measurement paper can show that a common proxy misses important behavior. A modeling paper can explain a capacity or scheduling tradeoff. A systems paper can build a controller that uses those insights. An algorithms paper can formalize decisions under uncertain workloads or changing resource availability.

For this meeting, I would use three examples of questions that fit that style. Does a cache save enough computation to justify its resource footprint? Does carbon-aware routing also reduce other environmental harms? And can an inference deployment meet demand under a limited power budget?

These questions are grounded in recognizable systems decisions. That is the bridge I want to make: sustainability can expose new measurement and control problems inside systems we already know how to build.

**中文提示：** “社区都玩什么”用方法地图回答：measurement、queueing/modeling、online optimization/control、resource management、accounting/incentives。这里是你的解读，不是承诺 reviewer 都按某一模板审稿。

来源：[SIGMETRICS 2026 CFP](https://sigmetrics.org/sigmetrics2026/call_for_papers.html)。

## 4. A familiar knob, a different optimum: GreenCache

**屏幕图建议：** 横轴 cache capacity，画 avoided recomputation 与 storage footprint 两个相反趋势；标注 conceptual sketch，不能冒充论文实测图。

**Script**

GreenCache is a good first example because caching is familiar to every systems researcher. Reusing a prompt's KV cache can avoid repeated computation, but storing that cache requires storage resources. The paper includes SSD embodied carbon in the tradeoff. [P2]

Its decision is therefore more interesting than simply maximizing cache hits. It adapts resource allocation to balance carbon and latency constraints under changing workload conditions. The useful conceptual shift is that the value of avoiding computation must be compared with the footprint of the resources used to avoid it.

In its reported Llama-3 70B experiment on the French grid, the paper reports average carbon reduction of 15.1 percent, with a maximum of 25.3 percent, while more than 90 percent of requests satisfy its latency constraints. These are results for that evaluation, not a general guarantee for every cache or workload.

The follow-up question I would bring to a collaboration is about decision boundaries. Under which workloads, reuse patterns, and hardware assumptions does the preferred cache configuration change? Can we predict that boundary with a lightweight model and use it online?

That would let us connect a sustainability objective with familiar techniques in workload characterization, caching, and adaptive resource management.

**中文提示：** 只报这一组实验数字即可；重点讲“加 embodied carbon 后，为什么配置选择可能变化”。不要说删掉 cache 就能抵消已经发生的 SSD 制造排放。

来源：[GreenCache 正文](https://arxiv.org/html/2505.23970v3)。SIGMETRICS 身份见[官方 accepted papers](https://sigmetrics.org/sigmetrics2026/accepted.html)。

## 5. Beyond carbon: HealthServe and WaterWise

**屏幕流程：** electricity → pollutant emissions → exposure → modeled health damage → routing/configuration。

**Script**

HealthServe gives an especially direct example of introducing a new objective. Carbon measures greenhouse-gas impact, while electricity generation can also produce pollutants whose health effects depend on location, atmospheric conditions, and population exposure. The paper translates those effects into modeled health costs and uses them alongside carbon and latency objectives. [P3]

The system jointly considers geographic routing and serving configurations. The important point for this talk is that a lower-carbon choice does not necessarily minimize health damage. The added metric can change which deployment is preferred.

These health costs are estimates derived from environmental and health-impact models. They are not clinical observations of illnesses caused by individual inference requests. A systems evaluation should preserve that distinction and expose uncertainty in the model.

WaterWise provides a complementary example. It studies carbon and water together in geographically distributed workload scheduling and shows why optimizing either objective alone can hurt the other. [P4]

The broader research question I take from these papers is: when is an existing objective an inadequate proxy? If two candidate configurations have similar carbon performance but different water or health consequences, the extra measurement may be decision-relevant.

For a new project, I would first look for such disagreements. I would then ask whether they occur often enough to matter, whether a system can respond within its latency and capacity constraints, and whether the gain remains under reasonable uncertainty. That sequence gives us a stronger case than simply adding another column to a benchmark table.

**中文提示：** HealthServe 是本场最重要的“新 metric → 新系统行为”例子。WaterWise 只作 30 秒补充。不要把 carbon-water 冲突说成所有地区、所有时刻都必然存在。

来源：[HealthServe 正式全文 DOI](https://doi.org/10.1145/3805638)、[WaterWise](https://arxiv.org/abs/2501.17944)。

## 6. Who owns the footprint?

**屏幕例子：** request A + request B → shared batch → one measured footprint；三条分配路线：tokens / leave-one-out / Shapley-based attribution。

**Script**

A different metrics problem appears when several users share a serving system. We can measure a batch's total energy, but that does not immediately tell us how to assign its carbon footprint to individual requests.

The carbon-accounting paper in the folder formalizes this problem using requests, the inference runtime, and a carbon model. It evaluates attribution through scalability, fairness, sample efficiency, and incentives, using Shapley values as a fairness reference. It also explains why simple leave-one-out attribution can fail to allocate the total consistently. [P5]

I would treat this as an accounting and mechanism-design question as well as a measurement question. A token-based allocation is easy to compute, but its simplicity does not by itself establish that it captures shared execution costs appropriately.

For a possible project, I would separate two outputs. One is a consistent allocation of the measured total to users. The other estimates how a candidate action, such as postponing or rerouting a request, changes the system's footprint. Those outputs answer different questions and need different validation.

This becomes practically interesting if the metric affects carbon budgets, billing, or user behavior. We could ask whether an inexpensive approximation preserves useful incentives while avoiding the computational cost of exact attribution.

**中文提示：** 这是 CarbonMetrics/PER 的工作，不要标成 SIGMETRICS 主会完整研究论文。Shapley 是在给定公理和 cost function 下的参照，不是物理真值。

来源：[Fair, Practical, and Efficient Carbon Accounting for LLM Serving](https://doi.org/10.1145/3764944.3764967)，已读取 Zotero 正文。

## 7. Power availability and inference architecture

**屏幕：** 左边 prefill–decode provisioning；右边 draft–target placement；下方写 workload × hardware × bandwidth × power。

**Script**

The other two papers from my email connect this discussion to inference architecture.

The analytical provisioning paper studies prefill–decode disaggregation. It models serving capacity and average power while accounting for workload lengths, compute and memory limits, queueing, and KV-cache reservations. Its output is a capacity–power Pareto frontier for candidate deployments. [P6]

That is useful because a provider may need to adapt to a changing workload or an available power budget. A model can help explain which provisioning choices remain feasible.

GreenLLM studies a different architectural choice. It combines prefill–decode disaggregation with disaggregated speculative decoding, placing draft and target computation on different GPU generations and selecting configurations with bandwidth, SLO, and carbon in mind. Its speculative path exchanges tokens and probability information rather than repeatedly moving large KV caches. [P7]

Together, these papers suggest a concrete place for systems expertise: explain how workload shape and hardware constraints change the best serving configuration. For our purposes, the next step would be to ask which additional objective or constraint changes that configuration again.

I would keep the claims separate. The provisioning paper is about power-aware capacity modeling; that alone does not establish lifecycle-carbon optimization. GreenLLM is an architecture and carbon-management example, published in Computer Architecture Letters.

**中文提示：** 两篇合起来讲约两分钟。不要把平均功率可行性讲成已经保证了瞬时峰值、电网稳定性或健康影响。

来源：[Analytical Power-Aware Provisioning](https://arxiv.org/abs/2609.24639)、[GreenLLM](https://doi.org/10.1109/LCA.2025.3630094)。

## 8. From average energy to power dynamics

**屏幕图建议：** 同一时间窗、相同积分面积，两条不同峰值和爬坡速度的示意功率曲线。

**Script**

LLM-PowerTrace adds another dimension: time resolution. It releases GPU power traces sampled every 100 milliseconds and examines behavior beyond total energy, including ramps and synchronization. It is currently a preprint. [P8]

The intuition is simple. Two deployments can consume similar energy over a fixed interval but have different power trajectories. That difference can matter to the infrastructure supplying them.

A possible systems project would connect those observations to a controller. Could we coordinate batch admission or power caps across replicas to reduce aggregate ramps while preserving useful serving throughput? The contribution would need to go beyond describing a trace: it would explain which control works, when it works, and what performance it costs.

There is also a measurement boundary. A 100-millisecond GPU trace supports claims at that observation scale. It cannot by itself establish sub-millisecond electrical safety or represent every component of facility power. We should match the claim to the instrument.

**中文提示：** 这是很好接 micro prototype 的方向，但 PowerTrace 已经定义动态指标；“增加 ramp metric”本身不能当作你的新颖性。

来源：[LLM-PowerTrace](https://arxiv.org/abs/2610.38315)。

## 9. How to build a useful new metric

**屏幕只放四个问题：** Missing effect? Decision reversal? Observable? Robust gain?

**Script**

Based on these examples, here is the process I would propose for developing a new metric.

First, identify the effect that an existing metric misses. It might be local environmental harm, shared-resource responsibility, or a power constraint that average energy hides. The metric should have a clear decision context and measurement boundary.

Second, demonstrate a decision reversal. Find configurations A and B for which the existing objective prefers A, while the additional objective gives a defensible reason to prefer B. Then test how frequently that disagreement occurs in realistic workloads. An isolated synthetic example is a starting point, but not sufficient evidence of practical value.

Third, make the metric observable or estimable at the required timescale. We should distinguish direct measurements from modeled quantities, include controller overhead, and ask how much estimation error changes the policy.

Fourth, evaluate the resulting decision under fixed service requirements. For AI inference, I would retain throughput, time to first token, time per output token, rejection rate, and a declared quality threshold. A system should not appear sustainable merely because it serves fewer requests, truncates useful work, or shifts work outside the measured interval.

One candidate reporting metric is footprint per successful, SLO-compliant task. I would present that as a proposed operational definition, not an established new standard. Its numerator includes the measured footprint of all attempts, including failures and retries; its denominator counts completed tasks satisfying the declared conditions.

Even then, I would report total footprint and completed demand alongside the ratio. Efficiency can improve while absolute resource use increases. For optimization, I would initially prefer explicit budgets and Pareto curves over combining carbon, water, health, and performance into one arbitrarily weighted number.

**中文提示：** 这是你自己的框架。强调“换 metric 后，系统会不会选不同 knob”比罗列十个指标更有说服力。Goodput 的思想已有，不要声称这条 ratio 本身首次提出。

## 10. Three research directions

**屏幕：** A. Useful work under resource budgets；B. Attributable shared serving；C. Coordinated power dynamics。

**Script**

I see three directions worth testing, with different levels of ambition.

Direction A is quality- and SLO-aware inference under resource budgets. We could begin with batching, power caps, and cache capacity while holding the model fixed. The question is whether a resource-aware controller can improve completed useful work under explicit constraints. Once that is understood, we could extend the action space to model selection or reasoning budgets. Those extensions require much more careful quality evaluation.

Direction B is actionable attribution in shared serving. We could compare a cheap online attribution method with an offline reference on small batches, then examine whether the accounting signal encourages useful behavior such as batching flexibility or cache reuse. The distinction between fair allocation and causal savings would be part of the design.

Direction C is coordinated inference for power dynamics. Independent replicas may each be locally efficient while producing an unfavorable aggregate power trajectory. We could test whether coordination reduces ramps or cap violations without sacrificing too much goodput.

My recommendation is to start with A as the prototype structure, and choose one environmental or power dimension for the first experiment. Trying to optimize carbon, water, health, quality, fairness, and grid behavior simultaneously would make it difficult to identify the source of any gain.

These are candidate directions, not claims that the problems are untouched. The literature already contains carbon-aware inference, attribution frameworks, and power characterization. We would need a focused related-work review around the exact mechanism before claiming novelty.

**中文提示：** 把第一步收敛到 2–3 个 knobs 和一个新维度。可以请 faculty 依据其系统经验，在 A/B/C 中判断哪个 bottleneck 最值得先测。

## 11. A first prototype and evaluation

**屏幕：** workload replay → measured response model → controller → serving runtime → telemetry。

**Script**

For a first prototype, I would use a small inference deployment and replay workloads with controlled request lengths, arrival patterns, and prompt reuse. We would measure latency, throughput, power, and the cost of changing configurations.

The initial model would predict the response of a few configurations. It could be empirical or analytical; the important requirement is that it explains enough of the tradeoff to support a decision. We could then build a controller that selects among those configurations as load or the resource budget changes.

The baseline set should make the comparison interpretable: a performance-oriented policy, an energy-oriented policy, an existing policy for the chosen additional metric, and an offline reference with future information. Ablations would remove either the new metric or the adaptive controller so we can see which part matters.

I would look for four outputs: a measurable disagreement between objectives, a useful performance–resource frontier, a controller that approaches that frontier at low overhead, and clear failure conditions. We should test unseen workload patterns and hardware settings where available, and vary uncertain environmental parameters.

A small experiment could establish the serving and control mechanism. If geographic environmental data are replayed rather than measured through an actual multi-region deployment, we should describe that part as a model-based evaluation. That separation would make the prototype's evidence credible and keep its scope manageable.

**中文提示：** 不承诺某个百分比。没有多地区硬件，就做单机实测加环境 trace replay，并明确边界。

## 12. Discussion

**Script**

The direction I am most interested in is supporting the growth of useful AI capability with better measurements and resource management. My macro-level perspective helps identify which impacts may matter; a systems collaboration could turn one of those impacts into an observable quantity and a working controller.

For a first project, I would like to find one case where the metric changes the decision and the system can exploit that change. From your experience, which part seems most promising to investigate first: inference provisioning, shared-resource accounting, or coordinated power management?

**中文提示：** 停在这个问题上，让对方讲。不要再加一页作者名单结束。

---

## 备份：三个公式与一个反例

### 1. 有效服务的环境效率（建议报告口径，不宣称新标准）

`F_useful = F_all_attempts / N_successful_tasks_meeting_quality_and_SLO`

`F_all_attempts` 包括失败、重试、draft/verification 和控制器的边界内开销。分母为零时报告不可定义，同时报告失败率。必须同时报告总 footprint、输入需求、成功数和 admission/rejection，避免通过拒绝请求改善比率。固定模型与任务集时先验证最清晰；跨任务质量聚合需要另行定义。

### 2. 将新增维度放入约束，而不是随便相加

`maximize useful goodput(x)`

`subject to: latency SLO; quality threshold; C_op(x) ≤ B_C; P_window(x) ≤ B_P`

这只是可选 formulation，具体选一个新增约束先做。C_op 使用与决策问题匹配、注明来源的强度信号；平均与边际强度不能互换。P_window 必须定义观测窗口；如研究峰值或 ramp，需要相应额外约束。Embodied carbon 更适合另设慢时标 provisioning/procurement 决策，不把固定历史制造排放当成每步可避免成本。

### 3. 功率动态的一个观测量

`R_Δ,0.99 = Q_0.99( |P(t) − P(t−Δ)| / Δ )`

它是 PowerTrace 使用的 ramp 表达方式之一，不是本报告新提出的 metric。比较时固定采样间隔、差分时间 Δ、聚合范围与任务需求。

### 4. 30 秒解释 energy ≠ carbon

纯教学假设，不是论文数据：配置 A 用 1 kWh、所在电网 600 gCO₂e/kWh，运行碳为 600 g；配置 B 用 1.2 kWh、所在电网 100 gCO₂e/kWh，运行碳为 120 g。B 能量更多，但该核算口径下运行碳更低。真实比较还要加入延迟、网络、设施与容量边界；这个例子不能单独证明真实电网的边际减排。

## 可能被问到的问题

**Q: Is this just energy optimization multiplied by another coefficient?**

Sometimes it is. If the coefficient is constant across all feasible actions and the system model is unchanged, it may not change the optimizer at all. The research opportunity appears when impacts vary across actions, locations, time, or shared execution, or when the objective changes constraints and incentives. We should demonstrate that variation before building a complex controller.

**Q: Why not optimize cost?**

Cost can correlate with resource use, but that is an empirical question. We should measure where it agrees with the environmental objective and where it does not, then report the cost of the environmental improvement.

**Q: Are health and water measured per request?**

Typically we measure computing activity and energy, then estimate environmental consequences using external models and data. We must report that chain, its geographic and temporal resolution, and its uncertainty.

**Q: Is Shapley the correct footprint?**

It is a principled allocation reference for a specified cooperative cost model. It does not directly measure the physical effect of removing one request, and its usefulness depends on the accounting question and computational budget.

**Q: Is a new metric enough for a SIGMETRICS paper?**

A metric needs evidence and an explanation of why it matters. A contribution might be a measurement methodology, a validated model, an algorithm, or a system built around it. For this project I would aim to connect the metric to a demonstrated decision change and an evaluated mechanism.

**Q: What can we do without a large cluster?**

Validate the inference response model and control mechanism on available hardware, then evaluate larger deployment scenarios through calibrated simulation or trace replay. Keep the conclusions tied to the part that was actually measured.

**Q: What is your contribution beyond the papers you just presented?**

At this stage, a proposed research question and evaluation plan. I would choose one mechanism, identify the closest prior work, and establish a reproducible limitation before claiming a new contribution.
