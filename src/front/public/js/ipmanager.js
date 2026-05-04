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
        allowedIpsTable.innerHTML += `<tr><td>${data[i].ip}</td><td>${data[i].temp? "Oui" : "Non"}</td><td>${data.identification ?? "Adresse Permanente"}</td></tr>`
    };

    // Chargement du tableau de droite    
    data = await (await fetch("/api/settings/ipqueue",{
        headers: {
            "x-auth-token": security_key
        }
    })).json();

    tempAllowedIpsTable.innerHTML = "";

    document.querySelectorAll(".ipapprovebtn").forEach(btn => {
        btn.removeEventListener("click");
    });

    document.querySelectorAll(".ipdeclinebtn").forEach(btn => {
        btn.removeEventListener("click");
    });


    for (i=0; i<data.queue.length; i++){
        tempAllowedIpsTable.innerHTML += `<tr><td>${data.queue[i].ip}</td><td>${data.queue[i].identification}</td><td><button class="ipapprovebtn btn btn-success me-5" title="Approuver la demande" data-identification="${data.queue[i].identification}" data-ip="${data.queue[i].ip}"><i class="bi bi-check"></i></button><button class="ipdeclinebtn btn btn-danger" title="Décline la demande" data-ip="${data.queue[i].ip}"><i class="bi bi-x"></i></button></td></tr>`
    };

    document.querySelectorAll(".ipapprovebtn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            await approveAccess(e.target.dataset.ip, e.target.dataset.identification);
        })
    });

    document.querySelectorAll(".ipdeclinebtn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            await declineAccess(e.target.dataset.ip);
        })
    });
};

async function approveAccess(ip, identification){
    const res = await fetch('/api/settings/tmpAuthorizationApprove',
        {
            method: 'POST',
            body: JSON.stringify({
                ip: ip,
                identification: identification
            }),
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": security_key
            }
        }
    )

    if (res.ok) {
        alert("Autorisation accréditée");
        loadIpManager();
    } else {
        alert("Une erreur s'est produite, merci de réessayer plus tard");
    }
}

async function declineAccess(ip){
    const res = await fetch('/api/settings/tmpAuthorizationDecline',
        {
            method: 'POST',
            body: JSON.stringify({
                ip: ip
            }),
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": security_key
            }
        }
    )

    if (res.ok) {
        alert("Demande déclinée avec succès");
        loadIpManager();
    } else {
        alert("Une erreur s'est produite, merci de réessayer plus tard");
    }
}