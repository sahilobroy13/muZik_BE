const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const emailService = require("../services/emailServices");
const blacklistToken = require("../models/blacklistToken.model");

const cookieOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: false,
};

async function registerController(req, res) {
    try {
        const data = req.body;

        if (!data.username || !data.email || !data.password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const checkUserExist = await userModel.findOne({
            $or: [{ username: data.username }, { email: data.email }]
        });

        if (checkUserExist) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashPassword = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS));

        const user = await userModel.create({
            username: data.username,
            email: data.email,
            password: hashPassword,
            role: data.role || "User"
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);
        await emailService.sendRegistrationEmail(user.email, user.username);

        return res.status(201).json({ message: "User Registered Successfully!", user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

async function loginController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!password || (!username && !email)) {
            return res.status(400).json({ message: "Please provide credentials." });
        }

        const user = await userModel.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({ message: "Logged in successfully!", user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function logOutController(req, res) {
    const { token } = req.cookies;

    if (token) {
        await blacklistToken.create({ token });
    }

    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logged Out Successfully!" });
}

async function dashboardController(req, res) {
    const user = req.user;
    return res.status(200).json({ message: "Welcome!", user });
}

module.exports = { registerController, loginController, logOutController, dashboardController };