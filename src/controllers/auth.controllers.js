const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

async function registerController(req, res) {
    try {
        const data = req.body;

        const checkUserExist = await userModel.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        });

        if (checkUserExist) {
            return res.status(400).json({
                message: "User already exists!"
            });
        }

        const hashPassword = await bcrypt.hash(
            data.password,
            Number(process.env.SALT_ROUNDS)
        );

        const user = await userModel.create({
            username: data.username,
            email: data.email,
            password: hashPassword,
            role: data.role
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true
        });

        res.status(201).json({
            message: "User Registered Successfully!",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

module.exports = { registerController };