const id = globalThis.location.pathname.split('/')[2];

const posts = document.getElementById("posts");
const votesRestantsTexts = document.getElementById("votesRestants");
const submitBtn = document.getElementById("submitBtn");
const resetVoteBtn = document.getElementById("resetVoteBtn");

let hashOnBoard = []
let selectedHashs = []
let votesRestants = 3;
let votesTotal = 3;

resetVoteBtn.addEventListener('click', () => {
    selectedHashs = [];
    votesRestants = 3;
    votesRestantsTexts.innerHTML = `Votes Restants : ${votesRestants}`

    Array.from(document.getElementsByClassName('card')).forEach((doc) => {
        doc.classList.remove("text-bg-warning")
        doc.classList.add("text-bg-light")
    })

})

submitBtn.addEventListener('click', () => {
    cookieStore.get(`session_${id}`).then((cookie) => {
        fetch(`/api/contribute/vote/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                selectedItems: selectedHashs,
                session_id: cookie.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (res.ok) {
                globalThis.location.pathname = "/thanks";
            } else {
                res.json().then((data) => {
                    alert(`Vote Impossible :\nVeuillez rééssayer\n Erreur: ${data.error}`)
                })
            }
        })
    })
})

function loadPostIts() {

    cookieStore.get(`session_${id}`).then((cookie) => {
        if (!cookie) {
            cookieStore.set(`session_${id}`, crypto.randomUUID())
        }
    })


    fetch(`/api/board/campaigns/${id}`).then((campaign) => {
        campaign.json().then((data) => {
            data.items.forEach(item => {
                if (!hashOnBoard.includes(item.id)) {
                    posts.innerHTML += `<div class="row card card-spacing text-bg-light col-10 offset-1" id="${item.id}" data-id="${item.id}"><div class="card-body">${item.content}</div></div><div class="separator">`
                    hashOnBoard.push(item.id)
                }
            });
            posts.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                if (card && posts.contains(card)) {
                    let id = card.dataset.id;
                    if (selectedHashs.includes(id)) {
                        selectedHashs = selectedHashs.filter((hash) => hash !== id)
                        card.classList.remove("text-bg-warning")
                        card.classList.add("text-bg-light")

                        votesRestants = votesTotal - selectedHashs.length;
                        votesRestantsTexts.innerHTML = `Votes Restants : ${votesRestants}`
                    } else if (votesRestants > 0 && !selectedHashs.includes(id)) {
                        selectedHashs.push(id)
                        card.classList.remove("text-bg-light")
                        card.classList.add("text-bg-warning")

                        votesRestants = votesTotal - selectedHashs.length;
                        votesRestantsTexts.innerHTML = `Votes Restants : ${votesRestants}`
                    }
                    console.log("vr:", votesRestants)
                    console.log("hashs:", selectedHashs)
                }
            })
        })
    })
}

loadPostIts();