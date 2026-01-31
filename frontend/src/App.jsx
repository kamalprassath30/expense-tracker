import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";

function App() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(
        "https://expense-tracker-1-0xim.onrender.com/expenses?sort=date_desc",
      );
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#f0f2f5", // light gray background
        padding: "2rem",
        boxSizing: "border-box",
        gap: "2rem", // space between form and table
      }}
    >
      <ExpenseForm onExpenseAdded={fetchExpenses} onRefresh={fetchExpenses} />
      <ExpenseTable expenses={expenses} />
    </div>
  );
}

export default App;
