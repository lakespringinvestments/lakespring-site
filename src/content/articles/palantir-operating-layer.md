---
title: "Palantir: Beyond Warfare Intelligence"
date: "2026-06-09"
byline: "Holdings deep-dive"
author: "Brian L."
excerpt: "The market calls it a war stock. That framing is too small — and it is costing investors a clear view of one of the most defensible software businesses ever built. Palantir's military contracts are the origin story. The commercial enterprise is the actual thesis."
coverImage: "/article-images/palantir-operating-layer.png"
coverPosition: "center 20%"
---

Everyone wanted to talk about Iran.

When Operation Epic Fury began on February 28, 2026 — the joint U.S.-Israeli air and missile campaign that the Pentagon openly described as the first conflict planned and executed using an AI targeting system — Palantir's stock surged. Television segments aired about "killer algorithms." Defense analysts debated the ethics of machine-assisted kill chains. Alex Karp gave interviews. The stock did what Palantir's stock does: it drew attention, then divided opinion sharply.

The "war stock" label attached quickly, and it is not entirely unfair. Palantir's Maven Smart System was deployed to coordinate strike missions across 13,000 targets in 38 days, with peak daily usage hitting approximately 20 billion AI tokens — usage that surged 38% on unclassified systems and 89% on classified networks compared to the prior month. The first 1,000 strikes happened within 24 hours, and the Pentagon's Chief Digital and AI Officer described the system publicly as consolidating nine separate military intelligence platforms into a single interface, compressing targeting decisions from hours to minutes. The Department of Defense then did something with lasting financial consequence: it designated Maven Smart System as an official program of record in March 2026, locking in Congressional funding through September 2026 and beyond, and transforming what began as an experimental project into permanent military infrastructure.

But here is the thing about Palantir: if the entire investment thesis rested on defense contracts and geopolitical volatility, it would not be one of the most interesting software businesses ever built. The war is the most visible application of Palantir's platform at any given moment. It is not the reason the company compounds.

The reason the company compounds is the ontology. And that requires some explanation.

---

## What Palantir Actually Built

Palantir was founded in 2003, seeded with CIA venture capital, and spent its first decade solving one of the hardest data problems in the world: how do you help analysts make sense of massive volumes of intelligence — satellite imagery, human reports, electronic intercepts, open-source data — when those inputs are fragmented, classified at different levels, and spread across agencies that don't share infrastructure?

The answer Palantir arrived at was not a better database. It was a fundamentally different concept of how software should relate to an organization's knowledge. They called it the ontology.

The ontology framework connects disparate data systems into a coherent operational model — it is what creates switching costs and defensibility. Large language models can be replaced; the organizational knowledge embedded in Palantir's ontology cannot be easily replicated.

The practical meaning of this: when an enterprise or government agency builds its operational model inside Palantir, the software doesn't just store data — it learns the relationships between the organization's concepts. In a defense context, the ontology maps the relationship between a sensor reading and a target category, between a weapons system and a delivery constraint, between a command authorization and a strike sequence. In a commercial context, it maps the relationship between inventory levels and supplier lead times, between machine failure patterns and production schedules, between a credit event and counterparty exposure.

These four pillars work in concert to create a closed-loop operational system. Data is ingested by Foundry or Gotham; it is contextualized by the Ontology; it is activated by AIP, allowing humans and AI to run simulations and propose actions; and when a decision is made, that action and its outcome are written back into the Ontology. This feedback loop enriches the digital twin over time, making future AI-driven recommendations more accurate and making the platform more indispensable with every decision it processes.

This is a compounding dynamic, not just a switching cost. The longer an organization runs on Palantir, the more the platform reflects that organization's specific decision logic — and the more catastrophic the knowledge loss from switching becomes. Once an organization's critical workflows are mapped and automated within Palantir's framework, migrating to a competitor's less integrated system becomes a prohibitively complex and risky proposition. Replacing Palantir doesn't mean buying different software. It means rebuilding the operational model of the institution from scratch, without the institutional memory the platform has accumulated.

That is the moat. Not the defense contracts. Not the government relationships. Not the classified clearances — though those are meaningful barriers too. The moat is the accumulation of organizational intelligence that deepens every quarter a client stays on the platform.

---

## The Platform Stack

Palantir's core offerings — Gotham for government and defense applications, Foundry for commercial enterprises, AIP for AI orchestration, and Apollo for software deployment — create high switching costs and a defensible moat.

**Gotham** is what the intelligence community and defense agencies have run on since the early 2000s. It was built to integrate classified data at the speed of operations — counterterrorism analysis, battlefield command, fraud detection across financial systems. Its security architecture was designed from the beginning for the hardest possible environment: data that cannot leave a secure facility, analysts that cannot be wrong, decisions that cannot wait. While most enterprise software companies started with commercial problems and later added security features, Palantir built its ontology-based platform to solve the hardest possible data integration challenge: connecting signals intelligence, human informant reports, and operational data to prevent terrorist attacks. That mission required a fundamentally different architecture — one that could map relationships between disparate data types while enforcing the strictest security and ethical constraints.

The consequence is that Gotham's security architecture, which had to work in a classified government environment, is what gives Palantir a structural advantage in regulated commercial industries — healthcare, finance, critical infrastructure — where competitors offering cloud-native AI tools cannot meet the data sovereignty and compliance requirements at scale.

**Foundry** is the commercial translation of the same underlying architecture. It connects a company's data silos into a unified operational picture: supply chain, manufacturing, logistics, finance, customer data — all of it mapped through the same ontology framework. Industries that have adopted it include energy companies like BP and ExxonMobil, automotive manufacturers like Stellantis, aerospace companies like Airbus, and hospital networks like HCA and Cleveland Clinic. Recent commercial expansions include nuclear deployment platforms, next-generation aviation AI foundations with Archer, American manufacturing reindustrialization through Warp Speed, and a strategic partnership with Databricks to deliver secure enterprise AI.

**AIP** — the Artificial Intelligence Platform, launched in 2023 — is what turned Palantir's growth trajectory from linear to explosive. It integrates large language models directly into the Foundry and Gotham environments, letting organizations use AI against their own operational data while maintaining security controls that prevent sensitive data from leaving the platform. The insight that AIP operationalizes is important: LLMs are becoming commodity infrastructure. The value is no longer in the model. The value is in the connective tissue between the model and the organization's actual data, context, and decision logic. That connective tissue is exactly what Palantir's ontology has been building for two decades.

---

## The Numbers Are Not Ambiguous

The financial picture that has emerged over the past eighteen months is one of the more remarkable acceleration stories in software history. But to understand the magnitude of the shift, it helps to start a few years earlier.

When Palantir went public via direct listing in September 2020 at $10 per share, its commercial business was an afterthought. Government revenue — the CIA, the NSA, the Department of Homeland Security, assorted defense agencies — accounted for roughly 60% of total revenue. Commercial revenue was growing, but slowly, and the perception on Wall Street was that Palantir was a defense contractor that had bolted on an enterprise product. Full-year 2020 revenue was $1.1 billion. The commercial segment contributed $373 million of that — around 34%.

The years that followed were difficult for shareholders. Revenue grew steadily but not explosively, and the company's stock fell from a peak near $45 in early 2021 to below $6 by late 2022 as rising rates hammered unprofitable growth stocks and the commercial inflection refused to arrive on schedule. Commercial customer count was climbing — from 34 commercial customers in 2020 to 167 by end of 2022 — but contract sizes were modest, sales cycles were long, and the enterprise AI wave had not yet broken.

What changed the trajectory was AIP, launched in mid-2023, and more specifically the Bootcamp model that accompanied it. The inflection in the numbers since then is stark.

In Q1 2025, U.S. commercial revenue grew 71% year-over-year and 19% quarter-over-quarter to $255 million, surpassing a $1 billion annual run rate. The company closed 139 deals of at least $1 million in a single quarter, with U.S. commercial total contract value up 183% year-over-year. Commercial customer count had expanded from 167 at the end of 2022 to over 500 by early 2025 — nearly tripling in under three years.

That was just the beginning. By Q3 2025, U.S. commercial revenue had grown 121% year-over-year, and the Rule of 40 score — a combined measure of revenue growth rate and free cash flow margin — had reached 114%. To put that in context: the Rule of 40 is the benchmark used to evaluate whether a software company is balancing growth and profitability well. A score of 40 is considered exceptional. Anything above 60 puts a company in elite company — Snowflake, Datadog, and CrowdStrike have all spent time in that range at their peaks. A score of 114 means Palantir is not just growing fast; it is simultaneously expanding margins at a pace that most software companies never achieve even when they are no longer growing at all. U.S. commercial customer count had grown 65% year-over-year alongside it, and the average contract value per customer was rising — a combination that signals genuine product-market fit, not just volume.

Q4 2025 delivered U.S. commercial revenue growth of 137% year-over-year and total revenue growth of 70%, with the company issuing FY2026 revenue guidance of 61% year-over-year — a figure it described as conservative given actual pipeline visibility.

Then Q1 2026 came in and the numbers moved again. Revenue grew 85% year-over-year — Palantir's highest-ever year-over-year growth rate — and U.S. revenue more than doubled. The company raised full-year 2026 revenue guidance to 71% growth, citing accelerating demand in the U.S. market. The Rule of 40 score reached 145%. Full-year 2026 guidance was subsequently raised to $7.65–$7.66 billion, above the $7.27 billion consensus estimate. Revenue per employee reached $1.5 million on an annualized basis. Commercial customer count reached 1,007 for the trailing twelve months ended March 31, 2026 — up 31% year-over-year and representing a roughly six-fold increase from where the commercial business started when Palantir first went public.

To be clear about what these numbers represent: a software company with nearly $8 billion in annual revenue is growing at 71% per year, expanding margins simultaneously, and accelerating. That combination is genuinely rare. As CEO Alex Karp wrote to shareholders:

> "Our financial results now demonstrate a level of strength that dwarfs the performance of essentially every software company in history at this scale."

![Palantir Revenue: The AIP Inflection](/article-images/pltr_revenue_inflection.png)

---

## How the AIP Bootcamp Changed Everything

The mechanism behind Palantir's commercial acceleration is worth understanding because it is not obvious from the outside.

Traditional enterprise software sales are slow. A company deploys a sales team, runs a procurement process, negotiates terms over months, runs a pilot, expands slowly. Palantir built most of its government business this way — deep, patient relationships with agencies over years. That model works for defense. It does not scale to the Fortune 500.

Instead of traditional multi-month sales cycles, Palantir now invites potential clients to build functional AI use cases in days through its AIP Bootcamp model. This "try-before-you-buy" at scale has compressed customer acquisition costs and accelerated the conversion of pilot programs into enterprise-wide licenses.

The bootcamp is a five-day intensive workshop where a company's own engineers and data teams work directly inside Palantir's platform using their own data to build a working AI application. The outcome is not a demo. It is a production-ready use case, built by the client's own people, that already works inside their operational environment. By the time procurement conversations begin, the client has experienced the platform firsthand and built something they don't want to throw away.

The results are visible in the customer count trajectory. Commercial customer count rose 34% year-over-year in Q4 2025, and Palantir had 1,007 commercial customers for the trailing twelve months ended March 31, 2026 — up 31% year-over-year. The bootcamp model has effectively democratized access to Palantir's platform for a wider range of enterprises while maintaining the high-value, high-retention characteristics of its traditional customer relationships.

![Palantir: Commercial Customer Growth](/article-images/pltr_customer_growth.png)

---

## The Defense Moat Is Deeper Than a Contract

Back to the war.

The framing of Palantir as a defense contractor benefiting from geopolitical conflict misses the structural nature of what has happened over the past twelve months. The Maven contract was initially awarded at up to $480 million in 2024 and later expanded to a ceiling of approximately $1.3 billion in 2025. The U.S. Army structured a broader agreement allowing up to $10 billion in Palantir-related data integration and AI procurement over a ten-year period.

Maven's designation as an official program of record is structurally significant: once a system achieves program of record status, it becomes part of the permanent budget planning process, ensuring predictable workflows and sustained revenue streams for years to come. For Palantir, whose government business is a core engine, this translates directly into improved revenue visibility and contract longevity.

A former senior defense official observed that if Palantir were to succeed in positioning Maven Smart System as the platform of platforms for CJADC2 — the Defense Department's Combined Joint All Domain Command and Control infrastructure — the effect would be to lock the Department into a decade-long dependency on a single commercial vendor for its central command-and-control infrastructure. That observation was meant as a warning. From an investment perspective, it is also a description of a moat.

The defense business has another characteristic that the commercial acceleration sometimes overshadows: it is now growing fast too. U.S. government revenue grew 66% year-over-year in Q4 2025 to $570 million — strong growth from a business that was previously considered the stable, slow-growing base. And the footprint extends well beyond U.S. borders. Palantir's platforms are embedded across NATO member governments, the UK Ministry of Defence, and intelligence and defense agencies across Western Europe and the Middle East — a network of sovereign relationships that is, by design, nearly impossible for a competitor to enter without decades of trust-building and classified clearance infrastructure.

![Palantir Revenue: Not Just a U.S. Defense Story](/article-images/pltr_revenue_segments.png)

---

## The Bear Case Deserves a Fair Hearing

There are legitimate critiques of Palantir, and dismissing them does not serve the thesis.

The valuation is genuinely demanding. The stock has traded at over 100 times forward sales, demanding flawless execution to sustain hyper-growth. Any stumble in the commercial ramp, any sign that the AIP Bootcamp model hits capacity constraints, or any macroeconomic softening in enterprise spending could quickly erode the premium.

Michael Burry raised a structural critique: Palantir's moat, he argued, may be partly "obstruction of data transfer" — switching costs built not just on genuine superiority but on making it difficult for customers to extract the analytical work they have done within the platform. The NYPD dispute he cited, where the department alleged Palantir would not provide data in a migrateable format after years of use, is a real case. The counterargument is that the ontology — the way Palantir structures organizational knowledge — is genuinely Palantir's intellectual property even if the underlying raw data belongs to the client. Both things can be true simultaneously.

Competitive threats from hyperscalers like AWS and Microsoft, which could pressure market share if they replicate Palantir's specialized capabilities, are a structural risk. Microsoft Azure hosts Palantir's government cloud deployments and captures infrastructure revenue in that relationship — the two companies are simultaneously partners and potential competitors. As AI capabilities become more standardized across cloud platforms, the question of whether Palantir's ontology advantage remains durable will become more pointed.

These are real risks. They are the reason Palantir is not a low-risk holding. They are also the reason the multiple is what it is — this is not a company priced for mediocrity. It is priced for continued dominance of a category it essentially created.

---

## Why the Commercial Acceleration Is Different This Time

There is a version of Palantir's history where the commercial business was always the promised land that never quite arrived. The company spent years discussing commercial potential while government contracts carried most of the revenue. Investors who waited for the commercial inflection lost patience at various points between 2020 and 2023.

What changed is AIP, and specifically what AIP exposed: there is enormous latent demand from enterprises that need AI to operate on their own data, in their own security environments, producing operational decisions rather than generative content. The hyperscalers sell AI as a cloud service. Palantir sells AI as an operational transformation — integrated into the workflows of the organization, running on the organization's data, producing outputs that feed directly into how the organization makes decisions.

The enterprises that are adopting this are not buying a product. They are replacing the operational logic of their business with a Palantir-managed digital twin. This growth is predicated on the continued expansion of AIP into industrial sectors including manufacturing, supply chain, healthcare, and financial services — and the scaling of its commercial Bootcamp model.

The addressable market for that offering is not a niche. Every large enterprise that has complex operational data, compliance requirements, and decisions that benefit from AI augmentation is a potential Palantir customer. The vertical expansion into healthcare, financial services, manufacturing, and critical infrastructure is still early. As of early 2026, Palantir is no longer viewed as a speculative defense contractor, but as the essential logic layer for both the United States government and the Fortune 500.

---

## The Investment Thesis

Palantir is not a war stock.

It is the company that built a two-decade head start on the hardest problem in enterprise software — connecting organizational knowledge to operational decisions at scale — and then had that architecture become the foundation for the AI era it did not fully anticipate building for. The defense business is the heritage of that head start. The commercial acceleration is what happens when the same architecture, hardened in the most demanding operational environments in the world, gets applied to enterprises that face structurally similar problems: too much data, too many systems, decisions that move too slowly.

Once Palantir's ontology is embedded in an organization's operations, it is genuinely difficult to remove. Not because the raw data is held hostage, but because the institutional logic — the relationships between concepts, the decision workflows, the AI agents running against live operational data — is rebuilt inside the platform over time. That accumulated knowledge is the switching cost. It is also the reason average contract values tend to expand rather than compress as customers mature on the platform.

That is not a description of a vendor. It is a description of infrastructure.

Whether the current valuation accurately prices that infrastructure is a fair debate. What is not a fair debate is the underlying quality of the business being built. Nine consecutive quarters of accelerating growth, a Rule of 40 score that has no peer in enterprise software, a defense business that just became permanent government infrastructure, and a commercial business that is barely two years into its inflection — the combination of those facts points in one direction.

The real size of the opportunity comes into focus when you consider what AI adoption at scale actually requires. Companies don't become AI-native overnight. They need a bridge — something that connects their existing data infrastructure, their legacy systems, their proprietary operational knowledge, to the AI layer that can make decisions against it. Palantir is that bridge. It is the on-ramp to full AI adoption for enterprises that cannot simply replace their entire technology stack, and it is the only platform purpose-built for exactly this translation layer. The world is generating more data than at any point in history, and with roughly 1,000 commercial customers against a global enterprise market of tens of thousands, the TAM is not quantifiable to the upside.

And then there is the dimension that rarely gets discussed plainly. Across every government, military, intelligence agency, hospital network, energy company, and financial institution it serves — across dozens of countries — Palantir has accumulated an operational view of the world that no other private entity can claim. Many people find that frightening, and that reaction is neither unreasonable nor limited to a fringe. But whether you find it unsettling or not, it is an irrefutable fact that the knowledge Palantir has embedded across the institutions that run our civilization is indispensable — and indispensability, at that scale, is not a side effect of the business. It is the business. If Palantir continues executing at the pace it has demonstrated over the past two years, it will very likely become one of the most important companies not just in western civilization, but in the world as we know today.

---

*Disclaimer: This is not financial advice. I'm sharing my personal investment thesis and research process. Do your own due diligence before making any investment decisions.*
