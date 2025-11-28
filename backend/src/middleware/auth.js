const jwt = require("jsonwebtoken");

function auth(req,res,next){
    const Header = req.header("Authorization");
    if (!Header) return res.status(401).json({msg:"No token, authorization denied"});

    const token = Header.split(" ")[1];
    if(!token) return res.status(401).json({msg : "No token, authorization denied"});
    try{
        const decode = jwt.verify(token,process.env.SECRET);
        req.user = decode;
        next();
    } catch(err){
        res.status(401).json({msg:"Token is not valid"});
    }
}

module.exports = auth;