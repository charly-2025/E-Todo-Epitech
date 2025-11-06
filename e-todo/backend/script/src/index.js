const dotenv = require("dotenv");

const cors = require("cors");
const path = require("path");
const express = require("express");
dotenv.config({path: path.resolve(__dirname,"../../../.env")});


console.log('MYSQL_USER =', process.env.MYSQL_USER);
console.log('MYSQL_DATABASE =', process.env.MYSQL_DATABASE);

const db = require("./config/db");
const authRouter =require("./routes/auth/auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use("/api/auth",authRouter);


app.get("/",(req,res) =>{
	res.send("Welcome");
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
	console.log("server launch on the port : "+PORT);
});
