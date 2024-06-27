const express = require("express");
const router = express.Router();
const User = require('../Schema/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const jwtkey = "samplekey";


router.post('/createuser', async (req, res) => {
    try {
        let result = await User.findOne({ mail: req.body.mail });
        if (result) {
            return res.status(400).json({ success: false, error: "User already exist with this mail" });
        }
        const haspass = await bcrypt.hash(req.body.password, 10);
        result=await User.create({
            username: req.body.username,
            password: haspass,
            mail: req.body.mail
        });
        const data = {
            id: result._id,
            username: result.username
        }
        const token =await jwt.sign(data, jwtkey);
         res.status(200).json({ authToken: token, success: true });
    } catch (error) {
         res.status(403).json({ success: false, error: error });
    }
}
)

router.post('/login',
    async (req, res) => {
        try {

            let user = await User.findOne({ mail: req.body.mail });
            if (!user) {
                return res.status(404).json({ success: false, error: "No user found" })
            }
            let pass = bcrypt.compare(req.body.password, user.password);
            if (!pass) {
                return res.status(404).json({ success: false, error: "Please enter valid password" })
            }
            const data = {
                id: user._id,
                username: user.username
            }
            const token = jwt.sign(data, jwtkey);

            res.json({ authToken: token, success: true });

        } catch (error) {
            res.status(400).json({ success: false, error: error });
        }
    })

module.exports = router;