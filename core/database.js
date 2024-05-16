const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2021128036",
    database: "note",
});

connection.connect();


module.exports = connection;
