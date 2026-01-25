const id = globalThis.location.pathname.split('/')[2];

//get inputs
let typeSelector = document.getElementById("typeSelector");
let contentInput = document.getElementById("contentInput");
let colorSelector = document.getElementById("colorSelector");
let sendBtn = document.getElementById("sendBtn");
let goToVoteBtn = document.getElementById("goToVoteBtn")
let sentPostitsContainer = document.getElementById("SentPostitsContainer");

let emptyMessage = "Aucun post-it envoyé pour le moment"

//colors data
let colors = {
    "red": "text-bg-danger",
    "blue": "text-bg-primary",
    "grey": "text-bg-secondary",
    "green": "text-bg-success",
    "yellow": "text-bg-warning",
    "skyblue": "text-bg-info",
    "white": "text-bg-light",
    "dark": "text-bg-dark"
}

const headers = [
    '<i class="bi bi-file-excel">&nbsp;</i>Pas Cool',
    '<i class="bi bi-eye">&nbsp;</i>A suivre',
    '<i class="bi bi-graph-up-arrow">&nbsp;</i>A améliorer',
    '<i class="bi bi-trophy">&nbsp;</i>Réussites'
];


function nettoyageChamps() {
    typeSelector.selectedIndex = 0
    contentInput.value = "";
    colorSelector.selectedIndex = 0
}

function sendPostIt() {
    const postIt = {
        type: Number.parseInt(typeSelector.selectedOptions[0].value),
        content: contentInput.value,
        color: colorSelector.selectedOptions[0].value
    }

    if (postIt.content != "" && !Number.isNaN(postIt.type) && postIt.type != 0) {
        fetch(`/api/contribute/${id}`, {
            method: "POST",
            body: JSON.stringify(postIt),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (res.ok) {
                alert("Post-It Envoyé");
            } else {
                alert("Post-It pas envoyé");
            }
        })
    }

    addPostItToSent(postIt);
    nettoyageChamps();

}

function addPostItToSent(postit) {
    if (sentPostitsContainer.innerHTML.includes(emptyMessage)) {
        sentPostitsContainer.innerHTML = "";
    }

    if (postit.content !== "") {
        sentPostitsContainer.innerHTML += `<div class="card ${colors[postit.color]}"><div class="card-body"><h5 class="card-title"><h4>${headers[postit.type - 1]}</h4>${postit.content}</h5><p class="card-text"></p></div></div><div class="separator"></div>`
    }
    return;
}


if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        sendPostIt();
    });
}

if (goToVoteBtn) {
    goToVoteBtn.addEventListener('click', () => {
        globalThis.location.href = `/vote/${id}`;
    })
}
