const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

router.post("/register",async(req,res)=>{
	const { email, password, name, firstname } = req.body;
	if(!email || !password || !name || !firstname) return res.status(400).json({msg:"bad parameter"});

	const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?",[email]);
	if (existingUser.length>0) return res.status(400).json({msg:"Account already exists"});

	const hashedPassword = await bcrypt.hash(password,10);

	const [result] = await db.promise().query("INSERT INTO users (email,password,name,firstname) VALUES (?,?,?,?)",[email,hashedPassword,name,firstname]);
	const token = jwt.sign({id:result.insertId},process.env.SECRET,{expiresIn:"1h"});
	res.json({token});
});

module.exports = router;


router.post("/login",async(req,res)=>{
	const { email, password} = req.body;
	if(!email || !password) return res.status(400).json({msg:"bad parameter"});


	const [user] = await db.promise().query("SELECT * FROM users WHERE email = ?",[email]);
	if (existingUser.length <= 0) return res.status(400).json({msg:"Invalid Credentials"});
	user = user[0]
	const same = await bcrypt.compare(password,user.password);
	if(!same) return res.status(400).json({msg:"Invalid Credentials"});

	const token = jwt.sign({id:user.id},process.env.SECRET,{expiresIn:"1h"});
	res.json({token});
});