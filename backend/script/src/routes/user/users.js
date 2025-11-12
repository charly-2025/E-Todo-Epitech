const express =require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");

router.get("/:id",auth,async(req,res)=>{
    const user_id = req.params.id;
    if(req.user.id!=user_id) return res.status(401).json({msg:"No good user, authorization denied"});
    const [data] = await db.promise().query("SELECT * FROM user WHERE id = ?",[user_id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.get("/:email",auth,async(req,res)=>{
    const user_email = req.params.email;
    if(req.user.email!=user_email) return res.status(401).json({msg:"No good user, authorization denied"});
    const [data] = await db.promise().query("SELECT * FROM user WHERE email = ?",[user_email]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.put("/:id",auth,async(req,res)=>{
    const user_id = req.params.id;
    if(req.user.id!=user_id) return res.status(401).json({msg:"No good user, authorization denied"});
    const { email, password, name, firstname } = req.body;
    let [user] = await db.promise().query("SELECT * FROM user WHERE id = ?",[user_id]);
    if (user.length <= 0) return res.status(400).json({msg:"Invalid Email Credentials"});
	user = user[0];
    const same = await bcrypt.compare(password,user.password);
    let newPassword;
    if(same) {
        newPassword = user.password;
    }else{
        newPassword = await bcrypt.hash(password,10);
    }
    await db.promise().query("UPDATE user SET email = ?,password = ?,name = ?,firstname = ? WHERE id = ?;",[email,newPassword,name,firstname,user_id]);
    return res.json({msg:"update ok"});
})

router.delete("/:id",auth,async(req,res)=>{
    const user_id = req.params.id;
    if(req.user.id!=user_id) return res.status(401).json({msg:"No good user, authorization denied"});
    await db.promise().query("DELETE FROM user WHERE id = ?",[user_id]);
    return res.json({msg:"delete ok"});
})


module.exports = router;