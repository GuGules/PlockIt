const id = globalThis.location.pathname
let col = 0;
var colData;

let title = document.getElementById('colonneTitle')
let colonneContent = document.getElementById('colonneContent')

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

document.getElementById('changeAffichageBtn').addEventListener('click', () => {
    globalThis.location.href = `${id}`;
});

document.getElementById('nextColBtn').addEventListener('click', () => {
    handleColumnNavigation('next');
});

document.getElementById('prevColBtn').addEventListener('click', () => {
    handleColumnNavigation('prev');
});

async function loadColumns(){
    // Appel API
    let res = await fetch(`/api/board/campaigns${id}?col=true`);
    let data = await res.json();
    console.log(data)
    colData = data.cols;
}

function showColumn(colIndex){
    title.innerHTML = colData[colIndex].name;

    colonneContent.innerHTML = '';
    
    colData[colIndex].items.forEach(element => {
        colonneContent.innerHTML += `<div class="card ${colors[element.color]}"><div class="card-body"><h5 class="card-title">${element.content}</h5><p class="card-text"></p></div></div><div class="separator"></div>`
    });

    col = colIndex;
    
    return;
}

function handleColumnNavigation(action){
    if (col < colData.length -1 && action === 'next') showColumn(col + 1);
    else if (col > 0 && action === 'prev') showColumn(col -1);
    return;
}

async function loadPage(){
    await loadColumns();
    showColumn(0);
}

loadPage();