require("dotenv").config();
const express = require('express')
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const app = express()
const authRoutes = require("./routes/authRoutes");

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", 'Authorization'],
    })
);

connectDB();

app.use(express.json());

console.log('authRoutes:', typeof authRoutes);



app.use("/api/auth", authRoutes);


//Server upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))