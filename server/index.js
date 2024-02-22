const express = require("express");
const dotenv = require("dotenv").config();
const { connection } = require("./config/db");
const cors = require("cors");
const { userRouter } = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors());

app.use("/user", userRouter)

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