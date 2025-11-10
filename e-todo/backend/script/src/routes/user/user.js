const express =require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");

router.get("/user",auth,async(req,res)=>{
    const [data] = await db.promise().query("SELECT * FROM users WHERE id = ?",[req.user.id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.get("/user/todos",auth,async(req,res)=>{
    const [data] = await db.promise().query("SELECT * FROM todo WHERE user_id = ?",[req.user.id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.get("/id/:id",auth,async(req,res)=>{
    const user_id = req.params.id;
    const [data] = await db.promise().query("SELECT * FROM users WHERE id = ?",[user_id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.get("/email/:email",auth,async(req,res)=>{
    const user_email = req.params.email;
    const [data] = await db.promise().query("SELECT * FROM users WHERE email = ?",[user_email]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.put("/id/:id",auth,async(req,res)=>{
    const user_id = req.params.id;
    const { email, password, name, firstname } = req.body;
    let [user] = await db.promise().query("SELECT * FROM users WHERE id = ?",[user_id]);
    if (user.length <= 0) return res.status(400).json({msg:"Invalid Email Credentials"});
	user = user[0];
    const same = await bcrypt.compare(password,user.password);
    

    await db.promise().query("UPDATE users SET email = ?,password = ?,name = ?,firstname = ? WHERE id = ?;",[email,password,name,firstname,user_id]);
})



module.exports = router;