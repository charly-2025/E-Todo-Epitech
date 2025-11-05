const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: path.resolve(__dirname,"../../../.env")});

const authRouter =require("./routes/auth/auth");


console.log('MYSQL_USER =', process.env.MYSQL_USER);
console.log('MYSQL_DATABASE =', process.env.MYSQL_DATABASE);
const db = require("./config/db");
const app = express();


app.use(express.json());

app.use("/api/auth",authRouter);
app.get("/",(req,res) =>{
	res.send("Welcome");
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
	console.log("server launch on the port"+PORT);
});
