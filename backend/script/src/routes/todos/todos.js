const express =require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");


router.get("/",auth,async(req,res)=>{
    const [data] = await db.promise().query("SELECT * FROM todo WHERE user_id = ?",[req.user.id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data);
})

router.get("/:id",auth,async(req,res)=>{
    const todo_id = req.params.id;
    const [data] = await db.promise().query("SELECT * FROM todo WHERE id = ?",[todo_id]);
    if (data.length === 0 ) return res.status(404).json({msg:"Not found"});
    res.json(data[0]);
})

router.post("/",auth,async(req,res)=>{
    const {title,description,due_time,user_id,status} = req.body;
    await db.promise().query("INSERT INTO todo (user_id,title,description,due_time,status) VALUES (?,?,?,?,?);",[user_id,title,description,due_time,status]);
    const [data] = await db.promise().query("SELECT * FROM todo ORDER BY id DESC LIMIT 1;")
    return res.json(data[0]);
})

router.put("/:id",auth,async(req,res)=>{
    const todo_id = req.params.id;
    const { title, description, due_time,user_id, status} = req.body;
    if(!title||!description||!due_time||!status) return res.status(400).json({msg:"bad parameter"});
    const [todo] = await db.promise().query("SELECT * FROM todo WHERE id = ?;",[todo_id]);
    if (todo.length <= 0) return res.status(404).json({msg:"Not found"});
    await db.promise().query("UPDATE todo SET title = ?,description = ?,due_time = ?,user_id = ?,status = ? WHERE id = ?;",[title,description,due_time,user_id,status,todo_id]);
    const [data] = await db.promise().query("SELECT * FROM todo WHERE id = ?;",[todo_id])
    return res.json(data[0]);
});

router.delete("/:id",auth,async(req,res)=>{
    const todo_id = req.params.id;
    const [todo] = await db.promise().query("SELECT * FROM todo WHERE id = ?;",[todo_id]);
    if (todo.length <= 0) return res.status(404).json({msg:"Not found"});
    await db.promise().query("DELETE FROM todo WHERE id = ?;",[todo_id]);
    return res.json({msg:"Succesfully deleted record number: "+todo_id});
})

module.exports = router;