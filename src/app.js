const express = require("express");
const userModel = require("./models/user.model");
const cookieParser = require("cookie-parser");
const authenticateUser = require("./middleware/auth.middleware");
const cors = require("cors");

const app = express();

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:3000",
    credentials :true,
}));

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/songs", require("./routes/songs.route"));
app.use("/api/playlist" , require("./routes/playlist.route"));


module.exports = app;