const express =require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");


router.get("/",auth,async(req,res)=>{
    const [data] = await db.promise().query("SELECT * FROM todo WHERE user_id = ?",[req.user.id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data);
})

module.exports = router;