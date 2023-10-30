const { BlackListModel } = require("../model/blackList.model")
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const exist = await BlackListModel.findOne({ "token": token })
        if (exist) {
            return res.status(400).send({ "msg": "please login again" })
        }
        else {
            jwt.verify(token, 'masai', async (err, decoded) => {

                if (decoded) {
                    req.body.username = decoded.username
                    req.body.userID = decoded.userID
                    next();
                }
                else {
                    res.status(400).send({ "erorr":"you are not authorized"});
                }
            });
        }
    } catch (error) {
        res.status(400).send({ "erorr": error.message });
    }
}

module.exports = {
    auth
}