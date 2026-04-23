# Building SplitMint: The Approach

SplitMint solves the UX friction of tracking shared expenses in small groups. When planning a trip or a night out, the focus should be on the experience, not doing math on the back of a napkin. SplitMint streamlines this.

### Why This Stack?
I built this with **React + Vite** for instantaneous development cycles. Using **Zustand** allowed me to avoid the boilerplate of Redux while maintaining robust, decoupled global state segments for users, groups, and expenses. **TailwindCSS** enabled the creation of a premium, cohesive design system (custom color palettes, rounded glass-like cards, seamless hover states) without writing extensive custom CSS.

### The Balance Engine & Settlement Algorithm
The core of the app is its Balance Engine (`balanceEngine.js`).
Tracking flows in a shared group is complex. My approach isolates it into two steps:
1. **Net Balance resolution**: Sum all out-flows (what you paid) and in-flows (what you owe across every expense) for each participant.
2. **Minimal Settlement Generation**: I use a greedy algorithm (`settlements.js`) where participants are sorted into debtors and creditors. By repeatedly settling the largest debt with the largest credit via two pointers, the system drastically reduces the number of transactions needed to square up, which is crucial for group harmony.

### MintSense AI
To elevate SplitMint beyond a standard CRUD app, I integrated "MintSense"—an AI buddy powered by Groq (LLaMA 3). MintSense brings two massive UX wins:
- **Natural Language Data Entry**: Typing "Dinner with Rohan for 800" automatically sets the form fields via structured JSON.
- **Group Summary**: Summarizes numeric debt grids into a friendly, readable narrative.

### Trade-offs & Reality Check
Building this in 48 hours necessitated strategic trade-offs:
- **No Backend**: By using `localStorage`, I skipped configuring a database, ORM, and JWT pipelines, relying on pseudo-auth instead. This maximizes feature breadth but sacrifices multi-device sync and true security.
- **Client-Side AI**: The Groq API call happens on the client side. In production, this would absolutely be proxied through a secure Node server or Edge function to protect the API key.

### With Another Week
Given another week, I would add:
- A real backend (Node.js/Next.js) with PostgreSQL.
- OAuth for frictionless sign-ups.
- Push notifications for settlement reminders.
- Multi-currency support and live exchange-rate conversations when splitting international tabs.
