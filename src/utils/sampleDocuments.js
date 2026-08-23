/**
 * Sample pre-loaded documents for instant demonstration and evaluation
 */

export const SAMPLE_DOCUMENTS = [
  {
    id: 'ai-research',
    title: 'Enterprise AI & Agentic Systems Whitepaper (2026)',
    subtitle: 'Strategic analysis on autonomous software agents and multimodal LLM architectures',
    type: 'PDF Document',
    size: 245000,
    pageCount: 3,
    text: `Executive Summary: The Evolution of Autonomous Agentic AI Systems

1. Overview and Industry Landscape
The rapid evolution of Large Language Models (LLMs) from reactive completion engines into proactive, autonomous agentic systems represents the next paradigm shift in enterprise computing. While first-generation generative AI focused on conversational query-response loops, modern agentic systems leverage tool calling, persistent memory graphs, multi-step planning, and autonomous feedback loops to perform complex end-to-end tasks.

2. Core Architectural Pillars
Modern agentic architectures depend on four critical capabilities:
- Dynamic Tool Orchestration: Empowering models to execute code, query vector databases, invoke REST APIs, and inspect filesystem artifacts dynamically.
- State Persistence and Context Management: Managing context windows efficiently through semantic caching, sliding window summarization, and vector store retrieval.
- Multi-Agent Collaboration: Dividing monolithic tasks into specialized subagents (e.g. Planner, Researcher, Coder, Auditor) to reduce hallucination rates and enhance output precision.
- Self-Reflection and Error Correction: Validating intermediate results against formal schemas and unit tests before finalizing outputs.

3. Key Findings and Quantitative Impact
Recent enterprise benchmarks indicate that autonomous agent workflows reduce software development lifecycle (SDLC) overhead by 42%, while improving codebase refactoring speed by 3.5x. However, enterprise adoption faces hurdles in latency management, API cost predictability, and security governance (particularly regarding unauthorized tool executions and prompt injection vectors).

4. Strategic Recommendations
- Implement isolated execution sandboxes for any runtime tool execution.
- Establish strict JSON schema validation layers between LLM outputs and backend APIs.
- Utilize lightweight, high-throughput models (such as Groq-accelerated LLaMA 3.3) for intermediary tool routing, reserving deep-reasoning models for architectural synthesis.
- Enforce granular token budgets and circuit-breaker telemetry across all agentic pipelines.`
  },
  {
    id: 'financial-quarterly',
    title: 'Global Fintech Q4 Financial Performance & Growth Report',
    subtitle: 'Consolidated balance sheet, revenue metrics, and strategic expansion outlook',
    type: 'Financial Report',
    size: 180000,
    pageCount: 2,
    text: `Q4 Consolidated Earnings and Strategic Growth Review

1. Financial Highlights & Performance Metrics
The fourth quarter delivered record financial results, driven by strong adoption of cross-border payment rails and automated treasury solutions:
- Total Gross Revenue: $142.8M, representing a 28.4% year-over-year increase.
- Net Operating Margin: Expanded by 320 basis points to 22.8%, benefiting from operational automation and optimized cloud infrastructure costs.
- Annual Recurring Revenue (ARR): Reached $480M, with net revenue retention (NRR) holding strong at 118%.
- Cash and Cash Equivalents: Ended the fiscal year with $215M in unencumbered reserves, providing substantial runway for strategic M&A.

2. Segment Breakdown & Customer Acquisition
- Enterprise Banking APIs: Revenue grew 34% YoY, onboarding 48 new tier-1 corporate clients.
- Automated Invoicing & Compliance: Grew 22% YoY, with transaction volume exceeding $4.2B.
- Customer Acquisition Cost (CAC): Decreased by 14% due to organic referral growth and developer-led ecosystem adoption.

3. Risk Factors & Operational Headwinds
- Currency Volatility: Fluctuations in European and Latin American foreign exchange markets reduced international transaction margins by 1.8%.
- Regulatory Compliance Costs: Increased investments in automated KYC/AML monitoring and ISO 27001 / SOC2 Type II certifications increased compliance expenditures by $4.5M.

4. Strategic Directives for Fiscal Year 2027
- Accelerate expansion into Southeast Asian emerging fintech corridors.
- Launch AI-assisted automated reconciliation to decrease manual audit overhead by 60%.
- Maintain disciplined capital allocation targeting sustained 25%+ free cash flow conversion.`
  }
];
