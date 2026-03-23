let security_key = "";

let allowedIpsTable = document.getElementById("iptable");
let tempAllowedIpsTable = document.getElementById("tmpiptable");

let res;

async function loadIpManager(){
    security_key = document.getElementById("passwordInput").value

    // Chargement du tableau de gauche
    
    const data = await (await fetch("/api/settings/authorizedIPs",{
        headers: {
            "x-auth-token": security_key
        }
    })).json();

    for (i=0; i<data.length; i++){
        allowedIpsTable.innerHTML += `<tr><td>${data[i].ip}</td><td>${data[i].temp? "Oui" : "Non"}</td></tr>`
    };

    // Chargement du tableau de droite

    

};