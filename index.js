const express = require("express");
const { connection } = require("./db");
require('dotenv').config()
const cors = require("cors");
app.use(cors());
const app = express();
app.use(express.json());
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes")
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("server run at port 8080");
    } catch (error) {
        console.log(error);
    }
})