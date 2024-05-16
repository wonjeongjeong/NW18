{/* <li>
    <div class="list-header">
        <a href="./view/20240314.html">
            <h1 class="title">오늘의 일기</h1>
        </a>
    <div>
        <span class="modify-btn">수정</span>
        <span class="delete-btn">삭제</span>
    </div>
    </div>
    <h2 class="description">힘든 목요일</h2>
    <div class="createAt">
        <span>2024.03.14</span>
    </div>
</li> */}


function getData(){ // localStorage 에서 데이터 받아오는 함수
    // const saveData = JSON.parse(localStorage.getItem("memo"));
    fetch("http://localhost:3000/lists", {
        method: "get",
    }).then(function(result) {
        return result.json();
    }).then(function (data){
        const memoWrapper = document.querySelector(".memo-container");

        while(memoWrapper.firstChild) {
            memoWrapper.removeChild(memoWrapper.firstChild);
        }

        for(let i = 0; i < data.length; i++){
            const memo = data[i];
            const list = drawMemo(memo);
            memoWrapper.appendChild(list);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    
    
}

function drawMemo(memo) {  // 맨 위의 주석을 참고하여 필요한 메모 리스트를 만드는 함수
    const li = document.createElement("li");


    const header = document.createElement("div");
    header.className = "list-header";

    const a = document.createElement("a");
    a.href = "/content?id=" + memo.id;

    const h1 = document.createElement("h1");
    h1.className = "title";
    h1.textContent = memo.title;


    const buttons = document.createElement("div");

    const modifyBtn = document.createElement("span");
    modifyBtn.textContent = "수정";
    modifyBtn.className = "modify-btn";

    modifyBtn.addEventListener("click", function(event) {  // 수정하는 페이지임을 알리는 쿼리스트링값 추가
        window.location.href = "/note?mode=modify&id=" + memo.id;
    });

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "삭제";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", function(event) {
        // const saveData = JSON.parse(localStorage.getItem("memo"));

        // for (let i = 0; i < saveData.length; i++){
        //     if (saveData[i].id === Number(memo.id)){
        //         saveData.splice(i, 1); // (삭제할 배열의 위치, 개수)
        //         localStorage.setItem("memo", JSON.stringify(saveData));
        //     }
        // }
        // getData();
        fetch("http://localhost:3000/delete", {
            method: "delete",
            headers:{
                "content-type": "application/json",
            },
            body: JSON.stringify({ id: memo.id }),
        }).then(function (result) {
            return result.json();
        }).then(function (data) {
            console.log(data);
            getData();
        }).catch(function(error){
            console.log(error);
        });
    });

    buttons.appendChild(modifyBtn);  // 자식 태그 추가 방법
    buttons.appendChild(deleteBtn);

    header.appendChild(a);
    a.appendChild(h1);  
    header.appendChild(buttons);

    const h2 = document.createElement("h2");
    h2.className = "description";
    h2.textContent = memo.description;

    const div = document.createElement("div");
    div.className = "createdAt";

    const span = document.createElement("span");
    console.log(memo);
    const now = new Date(memo.createAt);

    span.textContent = now.toLocaleDateString();

    div.appendChild(span);

    li.appendChild(header);
    li.appendChild(h2);
    li.appendChild(div);

    return li;  // 메모 하나당 리스트 하나 반환
}

getData();  // 함수 실행