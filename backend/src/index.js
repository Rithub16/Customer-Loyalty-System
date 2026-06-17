const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary storage
let customers = [];

// Home Route
app.get("/", (req, res) => {
    res.send("Customer Loyalty API Running!");
});

// Create Customer
app.post("/customers", (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Customer name is required"
        });
    }

    const customer = {
        id: customers.length + 1,
        name,
        points: 0
    };

    customers.push(customer);

    res.json(customer);

});

// Get All Customers
app.get("/customers", (req, res) => {
    res.json(customers);
});
// Purchase - Calculate Points
app.post("/customers/:id/purchase", (req, res) => {

    const id = Number(req.params.id);
    const { amount } = req.body;

    const customer = customers.find(c => c.id === id);

    if (!customer) {
        return res.status(404).json({
            message: "Customer not found"
        });
    }

    if (!amount || amount <= 0) {
        return res.status(400).json({
            message: "Invalid purchase amount"
        });
    }

    const points = Math.floor(amount);

    customer.points += points;

    res.json({
        message: "Purchase added successfully",
        earnedPoints: points,
        totalPoints: customer.points
    });

});


// Add Bonus Points
app.post("/customers/:id/bonus", (req, res) => {

    const id = Number(req.params.id);
    const { bonus } = req.body;

    const customer = customers.find(c => c.id === id);

    if (!customer) {
        return res.status(404).json({
            message: "Customer not found"
        });
    }

    if (!bonus || bonus <= 0) {
        return res.status(400).json({
            message: "Invalid bonus points"
        });
    }

    customer.points += bonus;

    res.json({
        message: "Bonus added successfully",
        totalPoints: customer.points
    });

});
// Summary
app.get("/summary", (req, res) => {

    const totalCustomers = customers.length;

    const totalPoints = customers.reduce(
        (sum, customer) => sum + customer.points,
        0
    );

    res.json({
        totalCustomers,
        totalPoints,
        customers
    });

});
// Start Server
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});