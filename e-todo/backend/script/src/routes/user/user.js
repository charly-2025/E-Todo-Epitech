const express =require("express");
const router = express.Router();
const sb = require("../../config/db");
const auth = require("../../middleware/auth");

router.get("/user",auth,async(req,res)=>{
    const [data] = await db.promise.query("SELECT * FROM users WHERE id = ?",[req.user.id]);
    if (data.lenght === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

module.exports = router;