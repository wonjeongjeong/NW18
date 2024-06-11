const createButton = document.querySelector(".save-btn");  // 저장 버튼
const modifyButton = document.querySelector(".modify-btn");  // 수정 버튼

const socket = new WebSocket('ws://localhost:3000');

modifyButton.addEventListener("click", function (event) {   // 수정 버튼 눌렀을 때 
    // const data = getData();
    const qs = getQueryString();
    const ele = getElement();

    const title = ele.title.value;
    const description = ele.description.value;
    const content = ele.content.value;
    const id = qs.id;

    // const saveData = JSON.parse(localStorage.getItem("memo"));  // localStorage에 있는 memo 데이터 가져옴

    // for(let i = 0; i < saveData.length; i++) {
    //     if (saveData[i].id === Number(data.id)) {  // id값으로 글 확인
    //         saveData[i].title = title;             // 현재 수정한 값을 memo 데이터 요소에 넣어줌. (원래 데이터랑 바꾸는 작업)
    //         saveData[i].description = description;
    //         saveData[i].content = content;
    //     }
    // }
    // localStorage.setItem("memo", JSON.stringify(saveData));  // localStorage에 수정한 saveData 저장
    
    // window.location.href = "/";   // 목록으로 되돌아감
    fetch("http://112.152.254.75:3000/modify", {
        method: "put",
        headers: {
            "content-type": "application/json",
        },
        body:JSON.stringify({
            title: title,
            description: description,
            content: content,
            id: id,
        }),
    }).then(function (result) {
        return result.json();
    }).then(function(data){
        console.log(data);
        if(data.status === "success") {
            window.location.href="/";
        }
    }).catch(function(error) {
        console.log(error);
    });
});

createButton.addEventListener("click", function(event) {
    event.preventDefault();
    const title = document.querySelector(".title").value;
    const description = document.querySelector(".description").value;
    const content = document.querySelector(".content").value;

    fetch("http://localhost:3000/create", {
        method: "post",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            description: description,
            content: content,
        }),
    })
        .then(function(response) {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json();
            }
        })
        .then(function(data) {
            if (data.status === "success") {
                alert(data.message);
                window.location.href = "/";
            }
            else {
                alert("게시글 작성 중 오류가 발생했습니다: " + data.message);
            }
        })
        .catch(function(error) {
            console.error(error);
            alert("게시글 작성 중 오류가 발생했습니다.");
        });
});
socket.onopen = function(event) {
    console.log("WebSocket connection established");
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    alert(data.message); // 서버로부터 받은 메시지를 alert로 표시
};

socket.onclose = function(event) {
    console.log("WebSocket connection closed");
};

socket.onerror = function(error) {
    console.error("WebSocket error observed:", error);
};
// createButton.addEventListener("click", function (event) {  // 버튼을 누를 때 (click) 생기는 이벤트 함수
//     const title = document.querySelector(".title");
//     const description = document.querySelector(".description");
//     const content = document.querySelector(".content");

//     const now = new Date();    // 오늘 날짜 받아옴
//     const saveValue = {   // 메모 작성한 내용 다 저장하기 위한 객체
//         title: title.value,
//         description: description.value,
//         content: content.value,
//         createdAt: now.toLocaleDateString(),
//     };
    

//     const saveData = localStorage.getItem("memo");   // localStorage에 memo 라는 이름의 아이템을 saveData라고 하자.
//     if(saveData === null){   // localStorage에 memo라는 아이템이 없다면 (게시판에 글이 하나도 없다면)
//         const array = [];
//         array.push(saveValue);     // value값을 array에 넣어준다.
//         saveValue.id = 1;   // id  1로 시작
//         localStorage.setItem("memo",JSON.stringify(array));   // localStorage로 보내기
//     }else{
//         const transform = JSON.parse(saveData);        // saveData를 JSON형식으로 다시 읽어오기
//         saveValue.id = transform.length + 1;           // id값은 현재 array의 길이 + 1 
//         transform.push(saveValue);                     // value값을 array에 넣어준다
//         localStorage.setItem("memo", JSON.stringify(transform));  // localStorage로 보내기
//     }

//     window.location.href = "/";
// });

function renderPage(){    // 쿼리스트링값이 create mode냐 modify mode냐에 따라 바뀌는 페이지
    const qs = getQueryString();

    if(qs.mode === "create"){
        createButton.style.display = "block"; // block : 보여지게 하는 것
        modifyButton.style.display = "none";  // none : 보여지지 않게 하는 것
    }else if(qs.mode === "modify"){
        createButton.style.display = "none";
        modifyButton.style.display = "block";
        fetch("http://112.152.254.75:3000/list/" + qs.id, {
            method: "get",
        })
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            renderMemo(data);
        }).catch(function(error) {
            console.log(error);
        });
        // const data = getData();        // localStorage에서 제목, 부제, 내용 값 받아옴.
        // renderMemo(data);              // 원래 저장해뒀던 내용 표시
    }
}

function getElement() {        // 데이터 가져오는 코드 반복돼서 함수로 만듦
    const title = document.querySelector(".title");
    const description = document.querySelector(".description");
    const content = document.querySelector(".content");

    return {title: title, description: description, content: content};
}


function getData() {  // localStorage 에서 데이터 받아오는 함수
    const saveData = JSON.parse(localStorage.getItem("memo"));

    const qs = getQueryString();

    let data;
    
    for (let i = 0; i < saveData.length; i++){
        if (saveData[i].id === Number(qs.id)){
            data = saveData[i];
        };
    }
    // renderMemo(data);  Modify일 때만 메모를 그려줄 때 한번만 호출 할 수 있게
    // renderPage함수 안에서 호출
    return data;
}

function renderMemo(data) {   // 원래 저장해뒀던 내용 표시하기 위한 함수
    const title = document.querySelector(".title");
    const description = document.querySelector(".description");
    const content = document.querySelector(".content");

    title.value = data.title;   // input 태그 -> value
    description.value = data.description;
    content.textContent = data.content;  // textarea 태그 -> textContent
}

function getQueryString() {  // ?mode=create&id=1  과 같은 ?이후의 쿼리스트링값을 받아오는 함수
    const qs = window.location.search;
    const qs2 = new URLSearchParams(qs);

    return {id: qs2.get("id"), mode: qs2.get("mode")};  // id와 mode값 반환
}

renderPage();