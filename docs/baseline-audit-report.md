# Baseline Audit Report – Rome Motor Cars Chatbot

## 1. Overview
Rome Motor Cars is a website that offers multiple cars. Customers visit the site and have many questions about cars, prices, features, policies, orders and refunds. This report describes how things work today and what problems exist, before the chatbot.

## 2. Current workflow (before the chatbot)
- A customer has a question about a car, price or policy.
- The customer has to contact the company, and a staff member answers manually.
- Staff look up the car details and policies by hand and reply.
- Orders and refund requests are also handled manually.

## 3. Problems found
- The company must appoint a dedicated workforce just to answer customer queries.
- New staff take time to learn the cars, prices and policies, so answers are slow or inconsistent.
- Searching through many cars and policies by hand wastes time.
- Customers wait for replies and may leave without buying.

## 4. Proposed solution
A simple chatbot on the website that shows customers the company's cars, their features and the policies, and answers questions instantly.

## 5. Tools and technologies audited and selected
| Tool | Purpose |
|------|---------|
| Python | Main programming language |
| LangChain | Connects the language model with the data (RAG) |
| Gemini API | Language model that generates answers |
| ChromaDB | Vector database for finding relevant information |
| Google Sheets | Stores car data, prices, discounts and policies |
| Google service account | Secure access to Google Sheets |
| Gmail (OAuth) | Sends order and refund emails |

## 6. Data sources
- Google Sheets containing car details, prices, discounts and company policies.

## 7. Conclusion
A RAG-based chatbot can remove most repetitive support work, reduce the need for a large support team, and give customers instant and consistent answers.
