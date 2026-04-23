# SplitMint 🪙

SplitMint is a full-featured, production-ready expense splitting web application designed to solve the UI/UX friction of tracking shared group expenses.

![SplitMint Dashboard Dashboard](https://via.placeholder.com/800x400.png?text=SplitMint+Dashboard)

## Features

- [x] **Store-based Architecture**: Persistent user sessions and data using Zustand + localStorage.
- [x] **Smart Balance Engine**: Efficient calculation of net balances and pairwise debts.
- [x] **Minimal Settlement Algorithm**: Greedy algorithm to reduce total transaction paths for settlements.
- [x] **Split Settings**: Split expenses equally, by custom amount, or by percentages.
- [x] **MintSense AI Integration**: Feature powered by Groq (LLaMA 3) to automatically parse natural language expense strings and summarize group activity.
- [x] **Interactive Data Visualization**: Bar charts and Pie charts via Recharts for beautiful data insights.
- [x] **Advanced Filtering**: Live search and filter expenses over descriptions and payers.

## Tech Stack Rationale

- **React 18 + Vite**: Chosen for lightning-fast HMR and optimized production builds. 
- **Tailwind CSS (JIT)**: Enables hyper-customized, responsive UIs via CSS utility classes without leaving the JSX context.
- **Zustand**: A small, fast, and scalable bearbones state-management solution perfectly suited for client-only data storage, chosen over Redux for its reduced boilerplate.
- **React Router v6**: Used for declarative nested routing across the app.
- **Recharts**: Makes building accessible, responsive, and composable declarative D3 charts straightforward.
- **Lucide React**: Crisp, modern iconography.

## Getting Started

To run SplitMint locally:

```bash
npm install
npm run dev
```

*Note: Create a `.env` file with your `VITE_GROQ_API_KEY=your_key` to enable MintSense AI features.*

## Architecture Decisions & Trade-offs

1. **No Backend (localStorage)**: The app runs 100% on the client. Chosen for speed of execution representing "technical depth" in front-end architecture. The trade-off is the lack of seamless multi-device sync or backend validation.
2. **Greedy Settlement Algorithm**: Used an O(n log n) sorting + greedy 2-pointer approach to match largest debtors with largest creditors. Given the max constraints (4 users), this provides optimal real-time settlement paths.
3. **Groq AI API**: Replaced mock parsing with legitimate payload structures over Groq's high-speed API (using LLaMA 3), ensuring a production-like NLP workflow.
4. **State modularity**: Decoupled `authStore`, `groupStore`, `expenseStore`, and `balanceStore` to mimic standard layered server architectures and normalize state updates easily.

## Known Limitations & Looking Forward
- Users are confined to a single browser storage.
- Real authentication and JWT issuance is substituted with hashed localStorage indexing.
- **Next steps**: Implementing a Postgres + Prisma backend via Next.js to provide instant WebSocket sync, push-notifications for balances, and multi-currency exchange-rate handling.
