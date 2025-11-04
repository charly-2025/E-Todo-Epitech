const mysql = require("mysql2");
const dotenv = require("dotenv");


const connection = mysql.createConnection({
	host : process.env.MYSQL_HOST,
	user : process.env.MYSQL_USER,
	password : process.env.MYSQL_ROOT_PASSWORD,
	database : process.env.MYSQL_DATABASE
});

connection.connect((err)=>{
	if (err) {
		console.error("connexion error",err.message);
	} else {
		console.log("connexion succesful");
	}
});
module.exports = connection;
