const app = require("./src/app");
const connectDb = require("./src/db/db");
require('dotenv').config();

connectDb();

app.listen("5000",()=>{
    console.log("Server is listening on port 5000 !");
})