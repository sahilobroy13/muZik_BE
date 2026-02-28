const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

async function authenticateUser(req,res , next){
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({message : "You are not logged In!"});
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user){
            res.status(404).json({message : "User Not Found !"});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({message : "Invalid Token!"})
    }
}

module.exports = { authenticateUser };