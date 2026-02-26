const userModel = require("../models/user.model");
const authControllers = require("../controllers/auth.controllers");
const express = require("express");

const router = express.Router();

router.post("/register", authControllers.registerController);

module.exports = router;