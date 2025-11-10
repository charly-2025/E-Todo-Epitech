const express =require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");


router.get("/",auth,async(req,res)=>{
    const [data] = await db.promise().query("SELECT * FROM todo WHERE user_id = ?",[req.user.id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data);
})

router.get("/id/:id",auth,async(req,res)=>{
    const todo_id = req.params.id;
    const [data] = await db.promise().query("SELECT * FROM todo WHERE id = ?",[todo_id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.post("/",auth,async(req,res)=>{
    const {title,description,due_time } = req.body;
    await db.promise().query("INSERT INTO todo (user_id,title,description,due_time) VALUES (?,?,?,?);",[req.user.id,title,description,due_time]);
    return res.json({msg:"create todo ok"});
})

module.exports = router;