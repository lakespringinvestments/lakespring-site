---
title: "Nvidia: The Gravity Well of AI"
date: "2026-05-22"
byline: "Holdings deep-dive"
author: "Brian L."
excerpt: "Strategy argues Nvidia is the gravitational center of AI infrastructure. The harder question: what would actually unseat them?"
coverImage: "/article-images/nvidia-gravity-well-of-ai.png"
coverPosition: "center center"
---

Somewhere along the way, the market got distracted.

After returning 239% in 2023 and 171% in 2024, NVIDIA spent most of the past twelve months trading sideways. The stock hit an all-time high near $212 in October 2025, plunged to $87 in April on tariff fears, and has since recovered to roughly $205. By NVIDIA's recent standards, that's a quiet year. Meanwhile, attention drifted — to SpaceX's IPO, to Palantir's government AI contracts, to the newer narratives that had room to run.

But here's what that sideways action obscures: NVIDIA just printed $215.9 billion in full-year revenue, up 65% year-over-year. Net income was $120.1 billion. In a single fiscal year, the company generated more net income than most nations produce in GDP. The stock hasn't moved much — the business hasn't stopped.

The reason to revisit NVIDIA now is not because the story has changed. It's because the story hasn't changed, and the market's reduced attention has produced a forward P/E of roughly 23 — below the semiconductor sector median, 42% below NVIDIA's own 10-year historical average, and a PEG ratio of 0.49 on a business growing revenue at 50–65% annually. That combination is worth pausing on.

This is my bull case.

---

## What NVIDIA Actually Is

NVIDIA started as a gaming graphics card company. In 2006, it made a bet that looked eccentric at the time: it released CUDA — Compute Unified Device Architecture — which let developers use GPUs for general-purpose computing, not just graphics. At the time, there was no AI industry. Deep learning was an academic curiosity. NVIDIA was building infrastructure for a market that didn't exist yet.

That 20-year head start is why the company dominates today. When deep learning exploded in the 2010s and researchers discovered that neural networks trained dramatically faster on GPUs, they trained them on NVIDIA hardware — because NVIDIA was the only company with accessible GPU programming tools. Every major AI framework that followed, PyTorch, TensorFlow, JAX, was optimized for CUDA first. Every university AI program taught CUDA. Every ML researcher learned NVIDIA tools first.

Today, more than 4 million developers have been trained on CUDA. Over 3,000 GPU-accelerated applications are optimized for NVIDIA. The switching cost is structural and severe: moving to a competitor doesn't just mean buying different chips. It means rewriting your codebase, retraining your engineering team, losing access to thousands of pre-built libraries, and accepting that any competitor still running on NVIDIA will iterate faster. An enterprise might save $10,000 per GPU by switching — and spend half a million in engineering time and delay their product launch by six months. Most stay on NVIDIA.

Gross margins of 74% on trailing twelve months don't come from hardware. They come from an ecosystem that has compounded for two decades and has no real substitute at the layer where it operates.

---

## The Numbers Behind the Thesis

Full-year FY2026 revenue was $215.9 billion, up 65% year-over-year. Data Center revenue alone was $193.7 billion, up 68%. To put these figures in perspective, the entire company did $60.9 billion in revenue in FY2024. In Q4 FY2026, NVIDIA generated $68.1 billion in a single quarter — more than its full-year revenue just two years prior.

The networking business is worth highlighting separately. NVLink and InfiniBand revenue hit $11.0 billion in Q4 alone, up 263% year-over-year. This isn't a side business. It reflects NVIDIA's deliberate expansion beyond GPUs into end-to-end AI infrastructure: the company now sells complete rack-scale AI factories, where the GPU, the CPU, the interconnect, and the software stack are all NVIDIA-designed and co-optimized. Every additional layer sold is a layer that a competitor cannot easily replicate and a customer cannot easily replace.

Return on equity was 114%. Debt-to-equity is 0.07. These are not numbers that emerge from a cyclical semiconductor business. They emerge from a platform with genuine pricing power and no credible near-term substitute.

![NVIDIA: From GPU Maker to AI Infrastructure](/article-images/nvidia_revenue_inflection.png)

---

## The Platform Keeps Advancing

The product cycle is what gives me sustained conviction. Architecture generations are no longer product launches — they are the mechanism by which NVIDIA ensures the gap between itself and competitors widens rather than closes.

Hopper (H100/H200) powered the first wave of large-scale AI deployment. Blackwell, which ramped through 2025, moved the unit of procurement to rack-scale systems — 72 GPUs in a single liquid-cooled rack, sold to hyperscalers that were placing orders 12–18 months in advance. Blackwell delivered $11 billion in revenue in its first quarter, NVIDIA's fastest product ramp in company history.

Now Vera Rubin is in full production. Announced at CES 2026 and confirmed at GTC 2026, it is not an incremental chip upgrade — it is a seven-chip, five-rack AI supercomputer architecture. The Rubin GPU features 336 billion transistors built on TSMC's 3nm process, a 1.6x increase over Blackwell, integrates HBM4 memory and NVLink 6 interconnects, and pairs with the new Vera CPU in a co-designed system. The Vera Rubin NVL72 claims 5x the inference performance of Blackwell at 10x lower cost per token. AWS, Google Cloud, Microsoft, Oracle, and CoreWeave are the first deployers, with availability in H2 2026.

The architecture after Rubin is already on the roadmap. Rubin Ultra arrives in 2027. Feynman is confirmed for 2028, introducing 3D stacking and custom HBM. Jensen Huang has moved NVIDIA to an annual architecture cadence. Each generation is designed before the previous one ships, which means the company is effectively 3–4 years ahead of wherever its competitors are trying to reach.

![The Roadmap That Widens the Gap](/article-images/nvidia_architecture_roadmap.png)

---

## The Shift to Agentic AI

The original investment thesis for NVIDIA rested on two workloads: training large models and running them at inference. That framing is now incomplete, and the incompleteness matters for the demand outlook.

At GTC Taipei 2026, Jensen Huang was direct about where computing is heading:

> "Agentic AI is just a digital robot. It understands, it reasons, it plans, and it acts and uses tools."

That single sentence reframes the demand picture entirely. The next paradigm is systems that reason across long contexts, use tools autonomously, browse the web, write and execute code, and interact with physical environments continuously. These workloads are fundamentally different from responding to a chat query. They don't sleep. An AI agent autonomously managing enterprise workflows generates sustained, continuous compute demand rather than intermittent inference bursts.

Vera Rubin is explicitly designed for this. The Vera CPU Rack within the platform supports 22,500 parallel CPU sandboxes — isolated execution environments for concurrent AI agents running simultaneously. The transition from passive AI to active AI represents a step-function increase in sustained compute demand, and Vera Rubin is the first platform purpose-built for it.

---

## The Hyperscaler Arms Race

None of this matters without buyers, and the buyers are in a structural spending race that has no visible exit.

![The AI Arms Race: $24B to $600B in 11 Years](/article-images/nvidia_hyperscaler_capex.png)

The big five hyperscalers — Amazon, Microsoft, Google, Meta, Oracle — committed approximately $443 billion in capex in 2025, a 73% year-over-year increase. For 2026, spending is projected to approach $600 billion, with roughly 75% tied to AI infrastructure. Goldman Sachs projects total hyperscaler CapEx from 2025–2027 will reach $1.15 trillion. Each of the four largest hyperscalers now individually exceeds $100 billion in annual infrastructure spending.

The dynamic driving this is a prisoner's dilemma. If Microsoft pulls back, AWS captures enterprise AI customers. If Google pauses, Microsoft wins. No single player can afford to slow down, which means the capital commitment is sticky even if individual ROI remains unproven. The companies most capable of moderating spending are the ones with the most to lose by doing so first.

NVIDIA is not just a beneficiary of this dynamic — it shapes it. When NVIDIA forecasts demand for the next generation, memory manufacturers build HBM production capacity to match. Server OEMs design chassis specifically for each new NVIDIA architecture. The entire supply chain scales in direct response to NVIDIA's product roadmap, which means NVIDIA's influence on the AI infrastructure economy extends well beyond the chips it ships.

---

## The Competition Is Real — And Losing Ground

This is the part of the NVIDIA bull case that deserves intellectual honesty rather than dismissal.

AMD is a legitimate competitor, and the progress is real. AMD posted $16.64 billion in Data Center revenue for full-year 2025, up 32% year-over-year. The MI300 series gained meaningful adoption at Microsoft, Meta, and Oracle. Most significantly, Meta has announced plans to deploy up to 6 gigawatts of AMD Instinct GPUs — a commitment that cannot be explained away as a trial. AMD's MI400 series, launching in H2 2026, targets hyperscale inference workloads with up to 432GB of HBM4 memory and is backed by a partnership with OpenAI to deploy 6 gigawatts of chips. CEO Lisa Su has publicly targeted double-digit market share gains and over 80% CAGR in Data Center AI revenue over the next 3–5 years.

Hyperscalers are also making real progress with in-house silicon. Google's TPUs handle significant internal workloads. Amazon's Trainium and Microsoft's Maia are both being deployed at scale for internal training runs. The motivation is genuine: reducing dependency on a single vendor improves supply chain resilience and negotiating leverage.

The honest read is that custom silicon and AMD together will likely capture 15–25% of the AI chip market by 2030. That is not a rounding error.

But here is the context that matters. NVIDIA's Data Center revenue in FY2026 was $193.7 billion. AMD's was $16.64 billion. The gap in absolute dollars is widening, not closing, because the total market is growing faster than AMD can gain share. AMD gaining 5 percentage points of a market that triples in size means NVIDIA's revenue still roughly doubles. And the CUDA moat — 4 million trained developers, 3,000 optimized applications, 20 years of ecosystem depth — is not a marketing claim. It is the reason hyperscaler enterprise customers continue to demand NVIDIA even when their own cloud provider is actively offering cheaper alternatives. ROCm, AMD's software platform, is a credible effort that is approximately 15 years behind CUDA in maturity. Closing that gap is not a capital expenditure problem. It is a time problem, and the time required means NVIDIA will have shipped two more architecture generations before AMD's software ecosystem reaches the depth CUDA has today.

![NVIDIA vs AMD: The Gap Is Widening](/article-images/nvidia_vs_amd_datacenter.png)

---

## The Manufacturing Moat

NVIDIA's chips require ASML's EUV lithography machines and TSMC's fabrication. Both are constrained, and both constrain NVIDIA's competitors more than they constrain NVIDIA.

ASML produces 50–60 EUV machines per year globally. The next-generation High-NA EUV machines that enable 2nm chips cost $350–380 million each, with only a handful shipped so far. There is no alternative manufacturer. TSMC, which fabricates 92% of the world's cutting-edge semiconductors, has reportedly allocated approximately 60% of its advanced packaging capacity to NVIDIA on a 12–18 month forward book. When new capacity comes online, NVIDIA gets first allocation.

The supply constraint reinforces NVIDIA's pricing power. Scarcity means demand from hyperscalers consistently exceeds available supply, which gives NVIDIA the ability to command margins that competitors with newer or cheaper chips cannot immediately undercut — because those competitors are competing for the same constrained manufacturing capacity that NVIDIA has already locked up.

NVIDIA also accelerates the manufacturing ecosystem it depends on. Its cuLitho computational lithography software makes chip mask design 40x faster and is provided to both ASML and TSMC. NVIDIA uses its own GPUs to help design and manufacture better GPUs, which means each generation produces tools that help build the next one faster — a compounding dynamic that no fabless competitor starting from scratch can replicate.

---

## The Ecosystem Nobody Talks About

What gets less attention than the hardware and the CUDA lock-in is the degree to which NVIDIA has structured its ecosystem so that AI growth in any direction — across any application, any geography, any compute layer — generates demand for its infrastructure.

Through NVentures, NVIDIA has invested in over 100 companies across AI applications, data infrastructure, robotics, and autonomous vehicles. The strategy is deliberately asymmetric: invest in companies that will consume NVIDIA GPUs as they scale. Databricks, Cohere, CoreWeave, Lambda Labs, Weights & Biases — every one of these companies, by definition, buys NVIDIA infrastructure as it grows. If individual investments fail, NVIDIA's downside is capped at the investment amount. If they succeed, NVIDIA captures the upside through both equity appreciation and the sustained GPU demand those companies generate as they scale. Capped downside, uncapped upside. In early 2026, NVIDIA took this logic further with its $20 billion acqui-hire of Groq, integrating Groq's LPU directly into the Vera Rubin platform to handle trillion-parameter decode work. Rather than compete with a potential rival, NVIDIA absorbed its technology into the platform.

NVIDIA also donates DGX systems to research labs, funds GPU grants for academic researchers, co-authors papers with Stanford, MIT, Berkeley, and Carnegie Mellon, and integrates CUDA into university AI curricula worldwide. Every engineer trained on CUDA is a future NVIDIA customer — not as a metaphor, but as a structural outcome. When those engineers join companies, they build on the tools they know. Today's PhD students become tomorrow's AI infrastructure decision-makers, and they have been trained, at scale, on NVIDIA's ecosystem. No competitor can replicate this without spending a generation in the field.

---

## The Relentless Machine

This is where I want to end, because it's what I think gets lost in the financial analysis.

NVIDIA just reported $215.9 billion in annual revenue — a number that makes it one of the largest companies in the world by any measure. It has $5 trillion in market cap. It controls more than 90% of the market for AI accelerators. Jensen Huang is widely considered the most strategically important CEO in the technology industry. By any conventional measure, NVIDIA has won.

And it is not pumping the brakes.

Vera Rubin, the most advanced AI computing platform ever shipped, is entering production this year. Rubin Ultra is in development for 2027. Feynman, with 3D stacking and custom memory architectures, is already on the roadmap for 2028. NVIDIA is simultaneously integrating acquired technology, building a venture portfolio of future customers, training the next generation of engineers on its tools, and providing the manufacturing software that helps its own chip supplier produce better wafers faster.

Most companies at this scale start optimizing for defense — protecting margins, managing competitive threats, maintaining what they've built. NVIDIA is doing the opposite. It is investing as if it has never been further behind, shipping as if it has never been further ahead, and racing as if the lead it has doesn't count unless it's actively widening it.

That relentless pace — the refusal to let the scale of the success become a reason to slow down — is, in the end, what this investment thesis rests on. The CUDA moat is real. The hyperscaler arms race is real. The product roadmap is real. But underneath all of it is a company that genuinely believes the AI revolution is still early, and is building accordingly.

NVIDIA is not a bet on a product. It's a bet on a company that has made itself indispensable to the most important technological transformation of the next decade — and then kept building anyway.

---

*Disclaimer: This is not financial advice. I'm sharing my personal investment thesis and research process. Do your own due diligence before making any investment decisions.*
