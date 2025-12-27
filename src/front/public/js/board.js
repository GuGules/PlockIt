const id = globalThis.location.pathname.substring(1);

//espaces tableau de bord
const pasCool = document.getElementById("pasCool");
const aSuivre = document.getElementById("aSuivre");
const aAmeliorer = document.getElementById("aAmeliorer");
const cool = document.getElementById("reussites");
const votesReportBtn = document.getElementById('votesReportBtn');
const votesResetBtn = document.getElementById('votesResetBtn');

document.getElementById('createCampaignBtn').addEventListener('click', function () {
    fetch('/api/board/createCampaign/',{
        method: 'POST'
    }).then((res)=>{
        if (res.ok){
            res.json().then((data)=>{
                globalThis.location.href = `/${data.campaign}`;
            })
        }
    })
})

document.getElementById('changeAffichageBtn').addEventListener('click', () => {
    globalThis.location.href = `/${id}?col=true`;
});

votesResetBtn.addEventListener('click',()=>{
    resetVotes();
})

let onBoard = [];
let colors={
    "red":"text-bg-danger",
    "blue":"text-bg-primary",
    "grey":"text-bg-secondary",
    "green":"text-bg-success",
    "yellow":"text-bg-warning",
    "skyblue":"text-bg-info",
    "white":"text-bg-light",
    "dark":"text-bg-dark"
}

function resetVotes(){
    fetch(`/api/board/campaigns/${id}/resetVotes`,{
        method:"POST"
    }).then((res)=>{
        if(res.ok){
            alert("Votes Réinitialisés")
        } else {
            alert("Erreur lors de la réinitialisation des votes")
        }
    })
}

// Chargement du tableau
function loadBoard() {
    let data = fetch(`/api/board/campaigns/${id}`).then((res) => res.json());
    data.then((campaign) => {
        campaign.items.forEach(item => {
            if (!onBoard.includes(item.id)) {

                let postIt = `<div class="row card card-spacing ${colors[item.color]} col-10 offset-1"><div class="card-body postit-content">${item.content}</div></div><div class="separator">`

                switch (item.type) {
                    case 1:
                        pasCool.innerHTML += postIt
                        break;
                    case 2:
                        aSuivre.innerHTML += postIt
                        break;
                    case 3:
                        aAmeliorer.innerHTML += postIt
                        break;
                    case 4:
                        cool.innerHTML += postIt
                        break;
                    default:
                        break;
                }

                onBoard.push(item.id)
            }
        });
    });
}

if (votesReportBtn){
    votesReportBtn.addEventListener('click', () => {
        globalThis.location.href = `/rapport/${id}`;
    });
}

if (id != "") {
    loadBoard();
    setInterval(() => {
        loadBoard()
    }, 5000)
}

