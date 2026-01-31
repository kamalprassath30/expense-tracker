# Expense Tracker App

## Description

A simple web-based expense tracker built with React. Users can:

- Add new expenses (amount, category, description, date)
- View all expenses in a table
- Filter expenses by category
- Sort expenses by date (newest/oldest first)
- See totals and category-wise summaries

## Key Design Decisions

- Used React functional components and hooks for state and data fetching.
- Centered form and table for clean UI.
- Validates required fields with inline error messages.
- Table shows totals and category-wise summaries.
- Added idempotency key for safe expense creation.

## Trade-offs / Timebox Decisions

- Basic inline styling; no external CSS framework.
- Backend API assumed; no backend implementation.
- Did not implement edit/delete expense or offline storage due to time constraints.
- No advanced theming or animations.

## How to Run

1. Clone the repo
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open browser at `http://localhost:5173`
