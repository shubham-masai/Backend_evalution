const express = require("express");
const { PostModel } = require("../model/post.model");
const postRouter = express.Router();
const { auth } = require("../middleware/auth.middleware");
postRouter.use(auth);
postRouter.post("/add", async (req, res) => {
    try {
        const { username, userID, title, body, device, no_of_comments } = req.body
        const post = PostModel({ username, userID, title, body, device, no_of_comments });
        post.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})



postRouter.get("/", async (req, res) => {
    const { page = 1, device } = req.body;
    const skipcount = (page - 1) * 3;
    // const query = {}
    // query.device = { $regex: device, options: "i" }
    try {

        const post = await PostModel.find({ username: req.body.username }).skip(skipcount).limit(3);
        res.status(200).send(post);

    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})

postRouter.get("/top", async (req, res) => {
    const { page = 1 } = req.body;
    const skipcount = (page - 1) * 3;
    try {
        const post = await PostModel.find({ username: req.body.username }).sort({ no_of_comments: -1 }).skip(skipcount).limit(3);
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostModel.findOne({ _id: id });
        if (!post) {
            return res.status(400).send({ "erorr": "post not found" });
        }
        if (post.username == req.body.username) {
            await PostModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).send({ "msg": "post has been updated" });
        }
        else {
            res.status(200).send({ "msg": "you are not authorized" });
        }
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})

postRouter.delete("/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostModel.findOne({ _id: id });
        if (!post) {
            return res.status(400).send({ "erorr": "post not found" });
        }
        if (post.username == req.body.username) {
            await PostModel.findByIdAndDelete({ _id: id }, req.body);
            res.status(200).send({ "msg": "post has been deleed" });
        }
        else {
            res.status(200).send({ "msg": "you are not authorized" });
        }
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
})
module.exports = {
    postRouter
}