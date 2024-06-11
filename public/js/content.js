function getData() {  // localStorage 에서 데이터 받아오는 함수
    const saveData = JSON.parse(localStorage.getItem("memo"));

    const id = getQueryString();

    for (let i = 0; i < saveData.length; i++){
        if (saveData[i].id === Number(id)){
            data = saveData[i];
        };
    }
    fetch("http://112.152.254.75:3000/list/" + id, {
        method: "get",
    })
    .then(function (result) {
        return result.json();
    })
    .then(function (data) {
        renderData(data);
    }).catch(function(error) {
        console.log(error);
    }); 

}

function getQueryString() {  // ?id=1  과 같은 ?이후의 주소값을 받아오는 함수
    const qs = window.location.search;
    const qs2 = new URLSearchParams(qs);

    return qs2.get("id");  // id값만 반환
}


function renderData(memo) {   // id값에 따라 달라지는 메모 내용을 표시하기 위한 함수
    const title =  document.querySelector(".title");
    const description = document.querySelector(".description");
    const createdAt = document.querySelector(".createDateTime");
    const content = document.querySelector(".content");

    const now = new Date(memo);
    title.textContent = memo.title;
    description.textContent = memo.description;
    createdAt.textContent = now.toISOString();
    content.textContent = memo.content;

}
getData();