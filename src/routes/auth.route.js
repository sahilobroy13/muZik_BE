const userModel = require("../models/user.model");
const authControllers = require("../controllers/auth.controllers");
const express = require("express");
const {authenticateUser} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", authControllers.registerController);
router.post("/login", authControllers.loginController);
router.post("/logout",authenticateUser,authControllers.logOutController);
router.get("/me",authenticateUser,authControllers.dashboardController);

module.exports = router;