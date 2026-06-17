import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [name, setName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalPoints: 0,
  });

  // Load Customers
  const loadCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
      loadSummary();
    } catch (error) {
      console.error(error);
    }
  };

  // Load Summary
  const loadSummary = async () => {
    try {
      const response = await axios.get("http://localhost:5000/summary");
      setSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Create Customer
  const createCustomer = async () => {
    if (!name) {
      alert("Please enter customer name");
      return;
    }

    try {
      await axios.post("http://localhost:5000/customers", {
        name: name,
      });

      alert("Customer Created!");
      setName("");
      loadCustomers();
    } catch (error) {
      console.error(error);
      alert("Error creating customer");
    }
  };

  // Add Purchase
  const addPurchase = async (id) => {
    const amount = document.getElementById(`purchase-${id}`).value;

    if (!amount) {
      alert("Enter purchase amount");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/customers/${id}/purchase`,
        {
          amount: Number(amount),
        }
      );

      alert("Purchase Added!");

      document.getElementById(`purchase-${id}`).value = "";

      loadCustomers();
    } catch (error) {
      console.error(error);
      alert("Error adding purchase");
    }
  };

  // Add Bonus
  const addBonus = async (id) => {
    const bonus = document.getElementById(`bonus-${id}`).value;

    if (!bonus) {
      alert("Enter bonus points");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/customers/${id}/bonus`,
        {
          bonus: Number(bonus),
        }
      );

      alert("Bonus Added!");

      document.getElementById(`bonus-${id}`).value = "";

      loadCustomers();
    } catch (error) {
      console.error(error);
      alert("Error adding bonus");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="container">
      <h1>Customer Loyalty System</h1>

      <input
        type="text"
        placeholder="Enter Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={createCustomer}>
        Create Customer
      </button>

      <hr />

      <h2>Customers</h2>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        customers.map((customer) => (
          <div
            key={customer.id}
            className="customer-card"
          >
            <h3>{customer.name}</h3>

            <p>
              <strong>Points:</strong> {customer.points}
            </p>

            <input
              type="number"
              placeholder="Purchase Amount"
              id={`purchase-${customer.id}`}
            />

            <button
              onClick={() => addPurchase(customer.id)}
            >
              Add Purchase
            </button>

            <br />
            <br />

            <input
              type="number"
              placeholder="Bonus Points"
              id={`bonus-${customer.id}`}
            />

            <button
              onClick={() => addBonus(customer.id)}
            >
              Add Bonus
            </button>
          </div>
        ))
      )}

      <div className="summary">
        <h2>Summary</h2>

        <p>
          <strong>Total Customers:</strong> {summary.totalCustomers}
        </p>

        <p>
          <strong>Total Points:</strong> {summary.totalPoints}
        </p>
      </div>
    </div>
  );
}

export default App;