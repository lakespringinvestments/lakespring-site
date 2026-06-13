---
title: "Amazon: The Everything Infrastructure"
date: "2026-05-10"
byline: "Holdings deep-dive"
excerpt: "AWS, Prime, advertising, logistics. The market prices Amazon as a retailer. The thesis is that it's the backbone of the digital economy — and the moat compounds with every dollar of capex."
coverImage: "/article-images/amazon.png"
coverPosition: "center 30%"
---

*Amazon is not a retailer that happens to run a cloud business. It is the full-stack infrastructure of modern commerce — from custom silicon to satellite internet — and the market is still debating whether it can justify the CapEx. The answer is already in the numbers.*

---

The standard way to analyse Amazon is by segment: retail, AWS, advertising, subscriptions, other bets. The segments are useful for accounting. They are misleading for understanding what the company actually is.

Amazon is the infrastructure through which a meaningful and growing share of all global commerce is initiated, processed, fulfilled, and delivered — and increasingly, the infrastructure through which the enterprises enabling that commerce build and run their own software. What makes this difficult to value using traditional frameworks is that every business unit inside Amazon reinforces each other. The retail operation builds the logistics network and generates the purchase-intent data that powers a $60 billion advertising business. That advertising margin funds AWS expansion. AWS provides the compute that trains and deploys the AI models now automating the logistics, the customer experience, and the software development itself. The result is a compounding loop where improvements in any one layer cascade through the entire system — and where the cumulative effect is a cost structure, a data advantage, and a distribution footprint that no competitor can replicate by building any single piece of it.

Understanding why Amazon compounds requires looking at each layer, then understanding how they interact.

---

## The Data Moat: What Amazon Knows That No One Else Does

Every major technology company has a data advantage, but Amazon's is commercially unique. Google captures what the world is curious about. Meta captures what the world engages with socially. Amazon captures what the world actually spends money on — and that distinction is the reason its fastest-growing businesses are growing at the pace they have been.

Amazon captures purchase-intent data at a scale no other platform can match. Hundreds of millions of active customers across more than 20 countries generate a continuous behavioural stream — product searches, clicks, cart additions, completed purchases, returns, reviews, and price comparisons — that describes not what people say they want, but what they demonstrably value enough to pay for. That is the most commercially actionable signal in the digital economy.

The advertising business is the clearest expression of this advantage. Amazon Ads has grown into a $60 billion-plus annual run rate business, making it the third-largest digital advertising platform in the world after Google and Meta. The reason it has grown so quickly is that Amazon advertising converts at rates no other platform can match — because the ads appear at the exact moment a consumer is actively shopping for the product being advertised. Google captures intent at the search stage. Meta captures attention at the browsing stage. Amazon captures intent at the purchase stage. For an advertiser, the difference in conversion economics is enormous, and it is the reason Amazon's advertising margins are among the highest in the company.

This data advantage extends beyond advertising. It informs inventory positioning — Amazon knows what products are likely to sell in which regions before the orders arrive. It informs pricing — dynamic pricing algorithms adjust millions of prices in real time based on demand signals, competitive data, and margin targets. It informs the logistics network — products are pre-positioned in fulfilment centres based on predicted demand, reducing delivery times and shipping costs simultaneously. And it increasingly informs the AI models that are beginning to automate every layer of the operation.

---

## AWS: The Cloud That AI Is Being Built On

Amazon Web Services generated $37.6 billion in revenue in Q1 2026, up 28% year-over-year and ahead of the $36.6 billion consensus estimate. For the full year 2025, AWS revenue reached approximately $128 billion, with an operating margin of 35%. The segment's long-duration remaining performance obligations — essentially its contractual backlog — reached $244 billion with an average life of 4.1 years, up 40% year-over-year. That is not a revenue estimate. It is a contractual commitment from enterprise customers that provides multi-year visibility into the CapEx payback.

AWS remains the largest cloud infrastructure provider in the world with approximately 30% market share. It is not growing as fast as Google Cloud's 63%, but it is growing at 28% on a revenue base that is nearly double Google's — which means AWS added more absolute revenue dollars in Q1 2026 than Google Cloud's entire quarterly revenue. Scale matters, and AWS has more of it than anyone.

The AI layer is where the growth is accelerating. Amazon disclosed that AI revenue is growing at triple-digit rates year-over-year, with Bedrock — the managed service that lets enterprises run foundation models on AWS infrastructure — as the primary growth driver. The Anthropic partnership is central to this: Amazon is Anthropic's largest investor and infrastructure partner, with Project Rainier — an $11 billion data centre campus in Indiana — built specifically for Anthropic workloads. Nearly 1 gigawatt of Trainium 2 and Trainium 3 capacity will be online for Anthropic by year-end 2026. This is the AWS-Anthropic axis: the cloud infrastructure powering one of the two or three most important frontier AI labs in the world, running on Amazon's own silicon.

![AWS: Revenue Growth Meets Margin Expansion](/article-images/amzn_aws_margin.png)


---

## Trainium: The Most Underappreciated Asset in the Thesis

This is where the investment case gets genuinely compelling — and where the market is, in my view, still underpricing what Amazon is building.

Amazon's custom AI chip program — Trainium for training and inference, Graviton for general compute — is not a side project. It is a structural cost advantage that compounds over time. Amazon has deployed over 1.4 million Trainium 2 chips, with Trainium 3 in production. CEO Andy Jassy stated on the Q1 2026 earnings call that at scale, Trainium is expected to save Amazon "tens of billions of dollars of capital expenditure per year" and deliver "several hundred basis points of operating margin advantage versus relying on others' chips for inference."

That sentence deserves a moment of consideration. Several hundred basis points of margin advantage on a $128 billion revenue base is not an incremental improvement. It is a structural moat. Since the majority of Bedrock's inference workloads already run on Trainium, the cost advantage is not theoretical — it is already showing up in the operating margin expansion that took AWS from 24% margins in 2022 to 35% in 2025, with projections for EBITDA margins approaching 35% company-wide by 2030.

To be fair, every hyperscaler is moving in this direction. Google has its TPU program, now in its seventh generation. Microsoft has Maia, its custom AI accelerator. Meta has MTIA for internal inference workloads. But there is a meaningful difference in deployment maturity and scale. Amazon has over 1.4 million Trainium chips deployed and running the majority of Bedrock's inference workloads today — not in a pilot program, not in a limited preview, but as the default compute layer for the platform's fastest-growing product. Google's TPU program is comparably mature but primarily serves its own internal workloads and Cloud customers. Microsoft and Meta are earlier in their custom silicon journeys and remain substantially more dependent on Nvidia for AI compute at scale. The $200 billion CapEx commitment for 2026 is not a gamble. It is a bet on a cost structure that is already proving out in the margin data — and on the conviction that the further Amazon scales Trainium, the wider the cost advantage becomes relative to competitors still paying third-party pricing for the majority of their inference capacity.

---

## The Logistics Network: A Physical Moat No One Can Replicate

Amazon's fulfilment and logistics network is one of the most extraordinary physical assets ever constructed by a private company.

The company now operates over 1 million robots across its fulfilment centres — stowing, picking, sorting, and transporting inventory. The integration of Proteus autonomous mobile robots has reduced fulfilment costs by an estimated 20% in upgraded warehouses. Amazon recently acquired RIVR, a developer of quadruped wheeled robots for last-mile doorstep delivery. More than 50,000 electric delivery vans are already operating globally. The company has invested approximately $25 billion in warehouse automation, with robotics positioned as the driver of step-level improvements in delivery speed and cost structure.

Prime Air, the drone delivery service, is targeting communities with 30 million customers by the end of 2026 and expects to deliver half a billion packages by drone by the end of this decade. The operational model — sub-hour delivery for lightweight packages without a human driver — compresses the last-mile cost structure in a way that ground-based delivery cannot match at scale.

And then there is the dimension that rarely gets discussed in the investment thesis: Amazon Leo, formerly Project Kuiper. This is Amazon's own satellite internet constellation — 3,236 planned satellites, with approximately 180 in orbit as of December 2025 and commercial service launching in 2026. Amazon Leo is a direct Starlink competitor, targeting residential, business, and government customers with flat-panel antennas offering 100 Mbps to 1 Gbps bandwidth. Contracts already signed include JetBlue, L3Harris, DirecTV Latin America, and the Australian government's broadband network.

Amazon does not need Blue Origin for space exposure. It already has its own space asset, directly owned, with commercial service launching this year. Blue Origin — Jeff Bezos's separate company — serves as the launch provider through New Glenn, but Amazon Leo is the infrastructure play. The strategic logic is clear: extend the AWS cloud edge to any geographic coordinate on Earth, provide connectivity to underserved markets, and integrate satellite backhaul into the existing logistics and enterprise infrastructure.

---

## Where AI Agents Accelerate the Payback

The $200 billion CapEx question — whether Amazon can generate returns fast enough to justify the spend — has a clear answer when you consider what AI is already doing inside the operation.

On the consumer side, Rufus — Amazon's AI shopping assistant — is live and learning from every interaction. Quick, the cross-application AI assistant, is being positioned to perform tasks across Amazon's ecosystem. These are early implementations of what becomes, at maturity, an AI agent that handles the entire shopping experience: product research, comparison, purchase, and returns — without the customer navigating a single product page.

On the enterprise side, Amazon Q (the AWS AI assistant) and Bedrock's agentic capabilities are automating software development, code review, and infrastructure management for AWS customers. Amazon internally disclosed that AI-generated code is already being deployed across its own engineering teams, compressing development cycles and reducing costs.

On the logistics side, AI and robotics are converging. The 1 million robots in fulfilment centres are increasingly guided by AI models that optimise routing, inventory placement, and demand prediction in real time. The path from here to fully autonomous warehouses — where AI agents manage robotic fleets from ingest to dispatch — is not a decade-long research project. It is an engineering execution problem, and Amazon is further along than any company in the world.

The CapEx return timeline compresses dramatically when AI agents are simultaneously reducing the cost of software development, automating logistics, and improving advertising targeting. The spend is not funding a single bet. It is funding the acceleration of every flywheel simultaneously.

![Amazon's Hidden Revenue Engine: Advertising](/article-images/amzn_advertising.png)


---

## The Numbers

Amazon's Q1 2026 results demonstrated the operating leverage the market has been waiting for.

Revenue reached $181.5 billion, up 17% year-over-year and significantly ahead of the $177.2 billion consensus estimate. North America revenue was $104.1 billion, up 12%. International revenue was $39.8 billion, up 19%. AWS revenue was $37.6 billion, up 28%.

Operating income was $23.9 billion with a 13.1% operating margin, up from $18.4 billion and 11.8% a year earlier — margin expansion despite the heaviest CapEx quarter in the company's history ($43.2 billion in Q1 alone). Full-year 2025 net income was $77.7 billion on revenue of $716.9 billion.

AWS operating income was $14.2 billion with a 35% operating margin. The advertising segment — while Amazon does not break it out separately — is now running at over $60 billion in annualised revenue and is widely understood to be among the highest-margin businesses in the company.

The $200 billion CapEx plan for 2026 is the number that dominates the conversation. It should be contextualised: Amazon spent $128.3 billion in 2025, up from $77.7 billion in 2024. The $200 billion figure is a 56% step-up, and Jassy has stated that the company "already has customer commitments for a substantial portion of it" and expects "compelling operating margins and ROIC." The $244 billion backlog with a 4.1-year duration provides contractual visibility that makes this less of a bet and more of a pre-funded buildout.

![The CapEx Is Pre-Funded: Spend vs Contractual Backlog](/article-images/amzn_capex_backlog.png)


---

## The Investment Thesis

At roughly 30 times forward earnings, Amazon is not expensive for what it is building. Some analysts argue it is fairly valued; Morgan Stanley maintains a $300 price target with an Overweight rating, calling Amazon "an underappreciated AI winner." Given the breadth of what the company controls — and the margin trajectory that is only beginning to materialise — I would lean toward the latter view.

The thesis comes down to a single conviction: Amazon will realise the return on its AI investment faster than any other company in the world. The reason is not that Amazon's models are better than Google's or Anthropic's. The reason is that Amazon has more surfaces on which to deploy AI immediately and at scale — the warehouses, the delivery network, the shopping experience, the advertising engine, the enterprise cloud — and that each deployment generates the data and cost savings that fund the next one. No other company has this combination of AI infrastructure, physical distribution, and consumer transaction data operating as a single integrated system.

The consumer data moat is permanent and widening. The logistics network is a physical asset that would take decades and hundreds of billions to replicate. Trainium is building a cost advantage that compounds with every workload that migrates onto the platform. Amazon Leo extends the infrastructure footprint to every coordinate on Earth. And the $244 billion backlog provides contractual proof that the demand for what Amazon is building is not speculative — it is already committed.

Amazon is the company that knows what the world buys, knows how to get it there, and is now building the AI infrastructure to make the entire chain autonomous. That is not a bet on any single technology. It is a bet on the most complete full-stack position in the AI-powered economy — and the company most likely to convert its CapEx into durable earnings power before anyone else.

---

*Disclaimer: This is not financial advice. I'm sharing my personal investment thesis and research process. Do your own due diligence before making any investment decisions.*
