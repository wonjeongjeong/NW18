const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "!Sehun0412",
    database: "note",
});

connection.connect();

// //연결이 안되는거 같아서 추가한 코드 - jjeongee
// connection.connect(error => {
//     if (error) {
//         console.error('Error connecting to the database:', error.stack);
//         return;
//     }
//     console.log('Connected to the database as id ' + connection.threadId);
// });

module.exports = connection;
