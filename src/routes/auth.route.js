const userModel = require("../models/user.model");
const authControllers = require("../controllers/auth.controllers");
const express = require("express");

const router = express.Router();

router.post("/register", authControllers.registerController);
router.post("/login", authControllers.loginController);
router.post("/logout",authControllers.logOutController);
router.get("/me", authControllers.dashboardController);

module.exports = router;