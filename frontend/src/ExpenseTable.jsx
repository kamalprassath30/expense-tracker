import { useState } from "react";

export default function ExpenseTable({ expenses }) {
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first

  // Filtered expenses based on selected category
  let filteredExpenses = filterCategory
    ? expenses.filter(
        (e) => e.category.toLowerCase() === filterCategory.toLowerCase(),
      )
    : expenses;

  // Sort filteredExpenses by date
  filteredExpenses = filteredExpenses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const totalAmount = filteredExpenses.reduce(
    (acc, e) => acc + parseFloat(e.amount),
    0,
  );

  const totalsPerCategory = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  const categories = [...new Set(expenses.map((e) => e.category))];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // center horizontally
        width: "100%",
        gap: "1rem",
      }}
    >
      {/* Centered content */}
      <div style={{ textAlign: "center" }}>
        <h2>Expenses List</h2>

        {/* Filters */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Filter by Category: </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: "1rem" }}>Sort by Date: </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <p>
          <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <h3>Category Summary</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(totalsPerCategory).map(([cat, total]) => (
              <li key={cat}>
                {cat}: ₹{total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "700px",
          overflowX: "auto", // responsive for small screens
        }}
      >
        <table
          border="1"
          cellPadding="5"
          style={{ width: "100%", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.amount}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
