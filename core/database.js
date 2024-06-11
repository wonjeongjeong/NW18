const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "tester",
    password: "1234",
    database: "note",
});

connection.connect();


module.exports = connection;
