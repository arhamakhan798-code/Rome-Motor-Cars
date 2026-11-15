# Rome Motor Cars – RAG Chatbot

An AI chatbot for the **Rome Motor Cars** website, a luxury automotive dealership platform that offers multiple vehicles. The chatbot appears as a concierge chat interface on the site and answers customer questions instantly, so staff don't have to answer the same questions again and again.

## What the chatbot can do
- Recommend cars based on filters set by the customer (for example budget, engine, and features)
- Give full information about a car, including price and features
- Explain company policies (returns, warranties, viewings, shipping)
- Book private checkouts and viewing appointments
- Create refund and inquiry requests
- Answer within a few seconds

## Tech stack
- **Next.js & TypeScript** / **Python & LangChain** – application logic and RAG pipeline
- **Gemini API** – language model that writes the answers
- **ChromaDB / Vector Search** – retrieves the most relevant car and policy information
- **Google Sheets** – stores live car details, prices, discounts, and policies
- **Google service account** – lets the app read and sync with Google Sheets
- **Gmail (OAuth)** – sends order, viewing, and confirmation emails to customers

## How it works (simple)
1. The customer types a question in the chat window.
2. The search engine retrieves the most relevant car and policy information from the live data.
3. Gemini uses that context to generate an accurate, elegant, and concise response.
4. For orders and viewings, the app collects customer details and synchronizes records directly.

## Project documents
- [Baseline Audit Report](docs/baseline-audit-report.md)
- [Project Charter and KPIs](docs/project-charter-kpi.md)
- Project master sheet: [Rome Motor Cars Master Inventory & Policies Sheet](https://docs.google.com/spreadsheets/d/19Wx2-Tqq9tMxIWzjDLVqDaPTHXKET30cDwU5ii4ZOLU/edit)

## Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/arhamakhan798-code/Rome-Motor-Cars.git
   cd Rome-Motor-Cars
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your keys (Gemini API key, Google Sheets ID, and Google Service Account JSON). **Never upload this file to GitHub.**
4. Run the development server:
   ```bash
   npm run dev
   ```

## Security note
API keys, the service account JSON credentials, and private tokens are strictly kept out of this repository using `.gitignore`.
