# SplitMint: Approach & Engineering Decisions

## 1. Executive Summary
This document outlines the architectural decisions, trade-offs, and design patterns utilized in building **SplitMint** during the 48-hour Karbon Business Hackathon assignment. 

As a candidate for the **Intern-AI Engineer** role at Karbon Business—a company known for corporate cards and robust expense management—I wanted to build an application that mirrors the complexities of real-world fintech products (ledgers, settlements, visualizations) while demonstrating practical, robust AI integration. 

My primary focus was **speed, technical depth, and ownership**. Instead of spending hours configuring a cloud backend, I built a highly responsive, standalone frontend application that handles complex business logic (greedy algorithms, NLP parsing) entirely on the client, supplemented by an LLM orchestration layer.

---

## 2. Core Architecture: Frontend-First & Local Storage
Given the 48-hour constraint, the biggest trade-off was deciding against a traditional Node.js/PostgreSQL backend.

*   **Decision:** Leverage React + Zustand for global state, persisted entirely to the browser's `localStorage`.
*   **Why:** This eliminates network latency during development, removes the need for database migrations, and allows the focus to remain completely on the core algorithmic logic and the AI integration.
*   **Trade-off:** The application lacks multi-device sync and real authentication. However, the data structures stored in Zustand (Users, Groups, Expenses, Splits) were designed *exactly* as relational database tables would be. Migrating this to a real backend (e.g., Prisma + Supabase) would be a near 1-to-1 mapping.

---

## 3. The Balance Engine & Settlement Algorithm
Fintech applications require mathematical precision. SplitMint handles custom, percentage, and equal splits.

*   **The Problem:** Calculating "who owes whom" across a web of interconnected expenses can result in circular debts (A owes B, B owes C, C owes A).
*   **The Solution:** I implemented a robust balance engine that first calculates the absolute **Net Balance** for each participant (Total Paid - Total Share). 
*   **The Greedy Algorithm:** To generate the minimal settlement path, the application uses a greedy algorithm algorithm (`src/utils/settlements.js`) that matches the maximum debtor with the maximum creditor repeatedly until all net balances reach zero.
*   **Precision:** To prevent micro-cent drift during floating-point operations, all financial data defaults to exact `.toFixed(2)` boundaries.

---

## 4. MintSense AI: Practical AI Integration
As an AI-focused assignment, the integration of Large Language Models (LLMs) needed to be more than just a chatbot. It needed to solve real user friction in expense management. I implemented this via the **MintSense AI** module, powered by the Groq API (using Llama 3 for ultra-low latency).

1.  **NLP to Structured Form Data:** 
    *   *Feature:* Users can type unstructured text (e.g., "Dinner with Rohan 800 split equally").
    *   *Implementation:* The system prompt strictly enforces a JSON output shape outlining description, amount, payer, mode, and category. The application parses this JSON and dynamically fully populates the UI state for the expense form. 
2.  **Smart Categorization:**
    *   The prompt intelligently maps the description to predefined specific application categories (Food, Travel, Utilities, etc.), defaulting appropriately out of bounds.
3.  **Intelligent Settlement Advice:**
    *   Instead of just showing raw data, the AI ingests the group's net balances and settlement arrays, returning a highly personalized, contextual paragraph prioritizing actionable advice (e.g., "Settle Rohan's largest ticket first via UPI").

---

## 5. UI/UX & Data Visualization
For a premium experience, raw data isn't enough. Users need insights.
*   **Stack:** Tailwind CSS for rapid, scalable styling; Recharts for responsive SVG visualization.
*   **Decisions:** 
    *   Created dynamic visual dashboards showing each participant's "Contribution vs. Share".
    *   Implemented live text filters, complex mapping boundaries (amounts/dates), and granular status searching.
    *   Prioritized edge cases: Addressed UX flows for attempting to remove participants who have linked expenses implicitly.

---

## 6. Trade-offs & Future Roadmap
If this were a production application built over several weeks, I would pivot the following:

1.  **Backend Migration:** Move the logic to a Node/Express REST (or GraphQL) API. Move from `localStorage` to PostgreSQL.
2.  **Authentication:** Strip the mocked JSON-bound Auth, implementing strict OAuth/JWT strategies.
3.  **AI Orchestration:** Shift the Groq API calls from the client-side directly to a secure backend microservice. Exposing API keys in Vite (even just for a hackathon) is a known security trade-off explicitly documented here for prototyping speed. 
4.  **OCR Integration:** Extend MintSense to securely ingest receipt photographs via a Vision model (like GPT-4o or Claude 3.5 Sonnet) extending structural JSON parsing beyond purely typed strings. 

---

## 7. Conclusion
Building **SplitMint** allowed me to demonstrate my ability to balance algorithmic complexity, highly-responsive frontend UX, and structural AI prompt chaining under strict time constraints. I am excited about the opportunity to bring this level of ownership, rapid prototyping, and product-focused engineering to the Karbon Business team.
