# Project Charter and KPI Document

## 1. Project name
Rome Motor Cars – RAG Chatbot

## 2. Goal
Build a chatbot for the Rome Motor Cars website that answers customer questions about cars and policies instantly, and handles orders and refund requests.

## 3. Problem statement
The company needs a dedicated team to answer customer queries, and new staff take time to learn the answers. This is slow and expensive.

## 4. Scope
**Included**
- Recommend cars based on customer filters
- Give full information about a car, including price and features
- Explain company policies
- Book private checkouts (orders)
- Create refund requests
- Email order and refund confirmations

**Not included (model project)**
- Real payment processing
- Live production use with real customer money

## 5. Key features
1. Car recommendations from customer filters
2. Complete car information (price, features)
3. Policy explanation
4. Private checkout booking
5. Refund request creation
6. Fast replies

## 6. Success metrics (KPIs)
| KPI | Target |
|-----|--------|
| Response time | Answers within a few seconds |
| Answer accuracy | At least 85% of questions answered correctly |
| Orders | Confirmation email sent for every order |
| Refund requests | Checked correctly against the refund policy |

## 7. Tech stack
Python, LangChain, Gemini API, ChromaDB, Google Sheets, Google service account, Gmail OAuth.

## 8. Documentation structure
- `README.md` – project overview and setup
- `docs/` – audit report and charter
- Project master sheet – task and progress tracker (link in README)

## 9. Timeline
| Week | Focus |
|------|-------|
| 1 | Scope definition and baseline analysis |
| 2+ | Follow the weekly plan given by the internship |
