const express = require("express");
const userModel = require("./models/user.model");
const cookieParser = require("cookie-parser");

const app = express();

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth.route"));


module.exports = app;