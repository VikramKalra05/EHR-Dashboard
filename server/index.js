const express = require("express");
const dotenv = require("dotenv").config();
const { connection } = require("./config/db");

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Home page")
})

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`The server is running at port ${PORT} and db is connected`);
    } catch (error) {
        console.log(error);
    }
})