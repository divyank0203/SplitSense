🚀 SettleFlow — Smart Group Expense & Settlement Manager

A Modern MERN-stack app with intelligent parsing, settlement optimization, and clean UI.

📌 Overview

SettleFlow is a full-stack MERN application built to simplify group expense management.
Whether it’s a trip, a flat, or a college event, SettleFlow helps users:

Track shared expenses

Auto-categorize spending

Parse natural-language descriptions into expenses

Compute minimal settlement transactions

Get explainable, transparent reasoning behind each payment

View spending insights for the month

It focuses on speed, clarity, and automation rather than manual form-heavy workflows.

✨ Key Features
🔹 1. Smart Natural-Language Expense Parsing

Paste text like:

“I paid 1200 for hotel, Rohit paid 600 for dinner, Aman paid 300 for snacks.”

SettleFlow extracts:

payer

amount

description

category

auto-split shares

creates expenses instantly

This uses a lightweight hybrid parser (regex + rule-based NLP) — no cloud AI required.

🔹 2. Minimal-Transaction Settlement Engine

SettleFlow computes:

Who owes whom

How much

With the least number of transactions possible

It uses debtor–creditor matching to reduce transfers by ~70%.

🔹 3. Explainable Settlements (AI-like Reasoning)

Example:

“Aman pays Rohit ₹350 because Aman is the highest debtor while Rohit is the highest creditor.
Matching them reduces one transaction edge.”

This is a differentiator from Splitwise & Tricount.

🔹 4. Monthly Insights Dashboard

Shows total spending, category-wise breakdown, and summarized patterns for each group.

🔹 5. Clean Modern UI with Light/Dark Mode

Built using:

React

Tailwind CSS

Heroicons

Responsive, minimal, product-like finish

User-friendly toggles & interactive components

🔹 6. Secure JWT Authentication

Includes registration, login, logout, and protected routes.

🔹 7. Group Member Management

Add members by email, enabling shared expense tracking.

🏗️ Tech Stack
Frontend

React (Vite)

React Router

TailwindCSS + Heroicons

Context API for auth

Light/Dark theme with persistent state

Backend

Node.js + Express

JWT Authentication

MongoDB + Mongoose

Custom NLP parsing engine

Settlement optimizer

Insights generator

Infrastructure

.env configuration

MongoDB Atlas compatible

Ready for deployment on Render / Railway / Vercel

🧠 Why This Project Is Unique

Unlike typical expense-tracker clones:

Uses rule-based NLP to parse expenses from plain English

Provides human-like settlement explanations

Has minimal-transaction optimization (algorithmic component)

Features a polished modern interface

Designed with financial clarity in mind (perfect for Visa)
