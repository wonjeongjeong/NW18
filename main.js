const express = require("express");
const conn = require("./core/database");

const app = express();

const server = require('http').createServer(app);


app.use(express.static(__dirname + "/public"));
  // static : html, css, js같이 바뀌지 않는 정적 파일

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", function(request, response){
    response.sendFile(__dirname + "/public/index.html");
});


app.get("/note", function(request, response){
    response.sendFile(__dirname + "/public/view/note.html");
});


app.get("/content", function(request, response) {
    response.sendFile(__dirname + "/public/view/content.html");
});

app.get("/lists", function(request, response) {
    conn.query("SELECT id, title, description, content, createdAt FROM list ORDER BY id DESC", function(err, result) {
        if(err){
            console.log(err);
            response.status(500).json({ message: "데이터를 읽어오지 못했습니다", status: "fail" });  //데이터를 읽어오지 못했음을 알리는 숫자
        }
        response.status(200).json(result);  // 200: 데이터를 읽어오는데 성공했다는 숫자
    });
});

app.get("/list/:id", function(request, response) { // *는 모든 필드를 의미함
    conn.query("SELECT * FROM list WHERE id = ?",[request.params.id],function(err,result) {
        if(err){
            console.log(err);
            response.status(500).json({ message: "데이터를 읽어오지 못했습니다", status: "fail" });  //데이터를 읽어오지 못했음을 알리는 숫자
        }
        response.status(200).json(result[0]);
    });
});

app.post("/create", function (request, response) {
    const { title, description, content } = request.body;
    conn.query("INSERT INTO list (title, description, content, createdAt) VALUES (?,?,?,now())" [request.body.title, request.body.description, request.body.content], function(err, result) {
        if(err){
            console.log(err);
            response.status(500).json({ message: "에러가 일어났습니다", status: "fail" });  //서버에서 에러났음을 알리는 숫자
        }


        response.redirect("/");

    });
});

app.put("/modify",function(request, response) {
    const data = request.body;
    conn.query("UPDATE list SET title=?,description=?,content=? WHERE id = ?",[data.title, data.description, data.content, data.id], function (err, result) {
        if(err){
            console.log(err);
            response.status(500).json({ message: "수정에 실패했습니다", status: "fail" });
        }
        console.log(result);
        response.status(200).json({ message: "수정에 성공했습니다", status:"success" });
    });
});

app.delete("/delete",function(request, response) {
    console.log(request.body);
    conn.query("DELETE FROM list WHERE id = ?",[request.body.id], function(err, result) {
        if(err){
            console.log(err);
            response.status(500).json({ message: "삭제에 실패했습니다.", status: "fail" });
        }
        response.status(200).json({ message: "삭제에 성공했습니다", status:"success" });
    });
});

app.listen(3000, function() {
    console.log("3000번 포트에서 서버가 실행중입니다.");
});