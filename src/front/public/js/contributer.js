const id = globalThis.location.pathname.split('/')[2];

//get inputs
let typeSelector = document.getElementById("typeSelector");
let contentInput = document.getElementById("contentInput");
let colorSelector = document.getElementById("colorSelector");
let sendBtn = document.getElementById("sendBtn");
let goToVoteBtn = document.getElementById("goToVoteBtn")

function nettoyageChamps(){
    typeSelector.selectedIndex = 0
    contentInput.value = "";
    colorSelector.selectedIndex = 0
}

function sendPostIt(){
    const postIt= {
        type : Number.parseInt(typeSelector.selectedOptions[0].value),
        content : contentInput.value,
        color : colorSelector.selectedOptions[0].value
    }

    if (postIt.content != "" && !Number.isNaN(postIt.type) && postIt.type != 0){
        fetch(`/api/contribute/${id}`,{
            method:"POST",
            body:JSON.stringify(postIt),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res)=>{
            if (res.ok){
                alert("Post-It Envoyé");
            } else {
                alert("Post-It pas envoyé");
            }
        })
    }

    nettoyageChamps();

}

if (sendBtn){
    sendBtn.addEventListener('click',()=>{
        sendPostIt();
    });
}

if (goToVoteBtn){
    goToVoteBtn.addEventListener('click',()=>{
        globalThis.location.href = `/vote/${id}`;
    })
}
