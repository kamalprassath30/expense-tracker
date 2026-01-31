import { useState } from "react";

export default function ExpenseForm({ onExpenseAdded, onRefresh }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const generateIdempotencyKey = () => {
    return "key-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    // Validate all fields on submit
    const newErrors = {
      amount:
        !amount || parseFloat(amount) <= 0
          ? "Amount must be greater than 0"
          : "",
      category: !category.trim() ? "Category is required" : "",
      description: "", // optional
      date: !date ? "Date is required" : "",
    };
    setErrors(newErrors);

    // Stop submission if any error
    if (Object.values(newErrors).some((err) => err !== "")) return;
    setLoading(true);
    const expenseData = { amount, category, description, date };
    const idempotencyKey = generateIdempotencyKey();

    try {
      const response = await fetch(
        "https://expense-tracker-1-0xim.onrender.com/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify(expenseData),
        },
      );

      if (!response.ok) throw new Error("Failed to create expense");

      const result = await response.json();
      setMessage(`Expense created!`);

      // Reset form and errors
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
      setErrors({ amount: "", category: "", description: "", date: "" });

      // Notify parent to refresh list
      onExpenseAdded();
    } catch (err) {
      console.error(err);
      setMessage("Error creating expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>New Expense</h2>
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "400px",
          marginBottom: "2rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // center all inputs
            gap: "1rem", // spacing between fields
          }}
        >
          <div>
            <label>Amount:</label>
            <br />
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  amount:
                    e.target.value <= 0 ? "Amount must be greater than 0" : "",
                }));
              }}
            />
            {errors.amount && <p style={{ color: "red" }}>{errors.amount}</p>}
          </div>

          <div>
            <label>Category:</label>
            <br />
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  category: !e.target.value.trim()
                    ? "Category is required"
                    : "",
                }));
              }}
            />
            {errors.category && (
              <p style={{ color: "red" }}>{errors.category}</p>
            )}
          </div>

          <div>
            <label>Description:</label>
            <br />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Date:</label>
            <br />
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  date: !e.target.value ? "Date is required" : "",
                }));
              }}
            />
            {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "150px",
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>

            <button
              type="button"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "150px",
              }}
              onClick={() => {
                setAmount("");
                setCategory("");
                setDescription("");
                setDate("");
                setErrors({
                  amount: "",
                  category: "",
                  description: "",
                  date: "",
                });
                setMessage("");
                if (onRefresh) onRefresh();
              }}
            >
              Refresh
            </button>
          </div>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
