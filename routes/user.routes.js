const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const { BlackListModel } = require("../model/blackList.model");

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body
    try {
        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(400).send({ "msg": "User already exist, please login" })
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                const user = UserModel({ name, email, gender, password: hash, age, city, is_married })
                await user.save();
                res.status(200).send({ "msg": "Account created." })
            });
        }
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (err) {
                    res.status(400).send({ "erorr": error.message });
                }
                else {
                    const token = jwt.sign({ username: user.name, userID: user._id }, 'masai', { expiresIn: "7d" });
                    res.status(200).send({ "msg": "user login", "token": token })
                }
            });
        }
        else {
            res.status(400).send({ "erorr": "User Not found" });
        }
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})


userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const black = BlackListModel({ "token": token });
        await black.save();
        res.status(200).send({ "msg": "user logout" })
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})
module.exports = {
    userRouter
}