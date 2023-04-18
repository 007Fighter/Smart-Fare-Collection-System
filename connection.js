const path = require('path');
const mysql = require('mysql');

const dotenv = require("dotenv");
dotenv.config({path: './config.env'})

const connection = mysql.createConnection({
    host     : process.env.Host,
    user     : process.env.User,
    password : process.env.Password,
    database : process.env.DataBase
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});
module.exports = connection;