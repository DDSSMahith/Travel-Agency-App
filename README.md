
# 🐼 The Flying Panda - Visa Slot Tracker (Internal Tool)

A high-performance internal dashboard built for the travel logistics team at **The Flying Panda** to track, manage, and analyze visa appointment availability across Schengen and global destinations.

## 🌟 Key Features
- **File-Driven Logic**: Pure JavaScript/TypeScript backend simulation using an async "File Storage" layer.
- **Panda AI Intelligence**: Leverages Gemini 3.0 Flash to provide real-time executive summaries of slot availability.
- **Strict Brand Design**: Professional white-and-green aesthetic (Emerald 600/950) with high-contrast accessibility.
- **Responsive CRUD**: Full Create, Read, Update, and Delete capabilities with integrated search and status filtering.

## 💾 Storage Decision: Why Files?
As requested, this app avoids heavy database overhead (like MongoDB) in favor of a **File Storage Model**.
- **The Architecture**: In a production Node.js environment, the app uses `fs.promises` to read/write `alerts.json`.
- **Browser Simulation**: We use a `localStorage` wrapper to simulate the exact behavior of file I/O, including async delays, write locks, and serialized JSON formatting.
- **Benefit**: Zero-config deployment, lightweight footprint, and easy data portability for the travel team.

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS (Styling), Font Awesome (Icons).
- **Intelligence**: Google Gemini API (Natural Language Analysis).
- **Backend Simulation**: Modular TS service with custom logging and validation middleware.

## 🧠 AI Usage vs Human Thought
- **AI (Gemini)** was instrumental in generating the CSS component library and the complex "Intelligence Report" logic.
- **Human Thought** was required for:
  - **The "File Storage" Abstraction**: Designing an async-aware storage bridge that mimics server-side disk operations in a client environment.
  - **Branding Consistency**: Fine-tuning the White/Green palette to ensure it feels like a premium internal enterprise tool.
  - **Middleware Design**: Implementing the `logger` and `validator` functions to follow Express.js patterns.

---
*Created for the High-Speed Visa Support Team at theflyingpanda.io*
