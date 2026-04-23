# SplitMint 🪙

**An AI-Powered Expense Splitting and Ledger Application.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq_Llama3-black?style=for-the-badge)

Built as part of the **Intern-AI Engineer** assignment for **Karbon Business**. SplitMint is a deep-dive into fintech logic, encompassing complex ledger algorithms, greedy settlement paths, and Natural Language Processing (NLP) parameter extraction.

---

## 🚀 Overview

SplitMint is a complete frontend solution that simplifies group expenses. Utilizing a strictly formulated greedy algorithm, the application inherently calculates absolute minimalist settlement matrices, drastically simplifying how friends and teams settle debts. 

Aimed at pushing bounds, it features **MintSense AI**, an orchestration module that parses raw conversational strings into robust, fully structured JSON financial inputs.

## ✨ Key Features

### 🧮 Advanced Financial Engine
*   **Multi-Modal Splits:** Handles Exact, Percentage, and Equal debt distribution.
*   **Greedy Algorithmic Settlements:** Intersects webs of group debts, automatically neutralizing circular debt and suggesting the minimal path of actual monetary transfers.
*   **Bulletproof Float Handling:** Enforces stringent `.toFixed(2)` logic arrays to prevent standard JavaScript decimal leakages.

### 🤖 MintSense AI Integration
*   **NLP Expense Parsing:** Type "Paid 500 for taxi with Rohan", and MintSense intelligently populates the form (Title: Taxi, Amount: 500, Category: Travel, Split: Equal).
*   **Smart Categorization:** Automatically maps untagged operations into distinct categories for downstream rendering.
*   **Contextual Advice:** Reads the underlying settlement JSON array and gives user-friendly, personalized directives on resolving cashflows gracefully.

### 📊 Comprehensive Tooling & Dashboards
*   **Granular Filtering:** Query transactions securely by amount bounds, specific localized date arrays, or involved participant logic arrays.
*   **Data Visualization:** Incorporates live Rechart metrics cleanly displaying contribution-vs-share logic at a glance.
*   **Robust Management:** Dynamically enforces constraints on groups, protecting arrays from wiping while linked expenses exist un-transferred.

---

## 🛠 Tech Stack

*   **Framework:** React 18 (Vite)
*   **State Management:** Zustand (w/ Local Storage persistence wrapper)
*   **Styling:** Tailwind CSS + Lucide React (Icons)
*   **Charts:** Recharts
*   **Date Formatting:** date-fns
*   **AI Provider:** Groq API (Llama-3 model series for rapid latency)

---

## 💻 Running the App Locally

Ensure you have Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sanket9673/SplitMint.git
   cd SplitMint
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add a Groq API Key to enable the MintSense features.
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view the app in your local browser.

---

## 📂 Project Structure Snapshot

```text
src/
├── components/       # Shared UI logic (Ledgers, Modals, MintSense Bar)
├── pages/            # View integrations (Dashboard, Group, History, Settle)
├── store/            # Zustand bounds (authStore, groupStore, expenseStore, balanceStore)
├── utils/
│   ├── balanceEngine.js      # Ledger operations
│   ├── settlements.js        # Greedy minimal-transfer algorithm 
│   ├── splitCalculator.js    # Divides multi-modal splits reliably
│   └── rounding.js           # Math float protectors
└── App.jsx           # Main generic routing matrix
```

---

## 🧠 Why Karbon Business?

This project was built over 48 hours for the **Intern-AI Engineer** hackathon. It specifically attempts to emulate the precise engineering expected at a company disrupting the corporate card and expense management sphere. Between processing complex dynamic ledgers natively without lag, visualizing debt arrays, and cleanly mapping AI NLP bounds bridging unstructured data into fintech-appropriate bounds, SplitMint represents high-velocity product thinking.

> For a deeper dive into the technical tradeoffs and architectural choices made, please see the approach.md file included in this repository.
