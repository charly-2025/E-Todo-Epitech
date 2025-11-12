const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
dotenv.config({path: path.resolve(__dirname,"../../../.env")});


console.log('MYSQL_USER =', process.env.MYSQL_USER);
console.log('MYSQL_DATABASE =', process.env.MYSQL_DATABASE);

const db = require("./config/db");
const registerRouter =require("./routes/auth/register");
const loginRouter =require("./routes/auth/login");
const userRouter = require("./routes/user/user");
const usersRouter = require("./routes/user/users");
const todosRouter = require("./routes/todos/todos");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","http://localhost:3000");
  res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization");

  if (req.method === "OPTIONS"){
    return res.sendStatus(200);
  }
  next();
});

app.use("/register",registerRouter);
app.use("/login",loginRouter);
app.use("/user",userRouter);
app.use("/users",usersRouter);
app.use("/todos",todosRouter);

app.get("/",(req,res) =>{
	res.send("Welcome");
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
	console.log("server launch on the port : "+PORT);
});
