const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

router.post("/",async(req,res)=>{
	const { email, password, name, firstname } = req.body;
	if(!email || !password || !name || !firstname) return res.status(400).json({msg:"bad parameter"});

	const [existingUser] = await db.promise().query("SELECT * FROM user WHERE email = ?",[email]);
	if (existingUser.length>0) return res.status(409).json({msg:"Account already exists"});

	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hashSync(password, salt);
	
	const [result] = await db.promise().query("INSERT INTO user (email,password,name,firstname) VALUES (?,?,?,?)",[email,hashedPassword,name,firstname]);
	const token = jwt.sign({id:result.insertId},process.env.SECRET,{expiresIn:"360h"});
	res.json({token});
});

module.exports = router;