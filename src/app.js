const express = require("express");
const userModel = require("./models/user.model");
const cookieParser = require("cookie-parser");
const authenticateUser = require("./middleware/auth.middleware");

const app = express();

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/songs", require("./routes/songs.route"));


module.exports = app;