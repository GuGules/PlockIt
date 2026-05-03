let security_key = "";

let allowedIpsTable = document.getElementById("iptable");
let tempAllowedIpsTable = document.getElementById("tmpiptable");

let res;

async function loadIpManager(){
    security_key = document.getElementById("passwordInput").value

    // Chargement du tableau de gauche
    
    let data = await (await fetch("/api/settings/authorizedIPs",{
        headers: {
            "x-auth-token": security_key
        }
    })).json();

    allowedIpsTable.innerHTML = "";

    for (i=0; i<data.length; i++){
        allowedIpsTable.innerHTML += `<tr><td>${data[i].ip}</td><td>${data[i].temp? "Oui" : "Non"}</td></tr>`
    };

    // Chargement du tableau de droite    
    data = await (await fetch("/api/settings/ipqueue",{
        headers: {
            "x-auth-token": security_key
        }
    })).json();

    tempAllowedIpsTable.innerHTML = "";

    for (i=0; i<data.queue.length; i++){
        tempAllowedIpsTable.innerHTML += `<tr><td>${data.queue[i].ip}</td><td>${data.queue[i].identification}</td><td><button class="ipapprovebtn btn btn-success" title="Approuver la demande" data-identification="${data.queue[i].identification}" data-ip="${data.queue[i].ip}"><i class="bi bi-check"></i></button></td></tr>`
    };

    document.querySelectorAll(".ipapprovebtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log(e.target.dataset.ip);
        })
    });
};

async function approveAccess(){} //TODO