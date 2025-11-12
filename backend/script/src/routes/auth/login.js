const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");


router.post("/",async(req,res)=>{
	const { email, password} = req.body;
	if(!email || !password) return res.status(400).json({msg:"bad parameter"});

	let [user] = await db.promise().query("SELECT * FROM user WHERE email = ?",[email]);
	if (user.length <= 0) return res.status(400).json({msg:"Invalid Email Credentials"});
	user = user[0]
	
	const same = await bcrypt.compare(password,user.password);
	if(!same) return res.status(400).json({msg:"Invalid Password Credentials"});
	const token = jwt.sign({id:user.id},process.env.SECRET,{expiresIn:"1h"});
	res.json({token});
});

module.exports = router;