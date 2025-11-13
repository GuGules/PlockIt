function getVoteUrl(){
    return `${globalThis.location.origin}/vote/${id}`
}

function getContributeUrl(){
    return `${globalThis.location.origin}/contribute/${id}`
}

function copyContributeUrl(){
    navigator.clipboard.writeText(getContributeUrl());
}

function copyVoteUrl(){
    navigator.clipboard.writeText(getVoteUrl());
}

function getCampaigns(){
    let campaigns= "Voici la liste des campagnes:\n"
    fetch("/api/board/campaigns").then((res)=>{
        if(res.ok){
            return res.json().then((data)=>{
                data.campaigns.forEach((campaign)=>{
                    campaigns += `${globalThis.location.origin}/${campaign}\n`
                })
                console.log(campaigns)
            })
        } else {
            console.error("Erreur lors de la demande des campagnes")
        }
    })
}