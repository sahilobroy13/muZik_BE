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

async function loginController(req,res){
    const { username , email , password} = req.body;
    const user = await userModel.findOne({
        $or:[
           { username : username},
           {email : email}
        ]
    })
    if(!user){
        res.status(400).json({
            message : "User not exist!"
        })
    }
    const isValid = await bcrypt.compare(password,user.password);
    if(!isValid){
        res.status(401).json({message: "Invalid Credentials!"});
    }

    const token = jwt.sign({id: user._id, role : user.role}, process.env.JWT_SECRET);
    res.cookie("token" , token);

    res.status(200).json({message : "Logged in Successfully!",user});
}

async function logOutController(req,res){
    res.clearCookie("token");

    res.status(200).json({message : "Logged Out Successfully!"});
}

async function dashboardController(req,res){
    const token = req.cookies.token;
    console.log(token)
    if(!token){
        res.status(401).json({message : "You are not logged In!"});
    }
    const decoded = await jwt.verify(token , process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if(!user){
        res.status(404).json({message: "User not Found!"});
    }
    res.status(200).json({message : "Welcome to Dashboard!"});
}

module.exports = { registerController , loginController , logOutController , dashboardController};