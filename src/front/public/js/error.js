let errorBtn = document.getElementById('degageBtn')
let askAccessBtn = document.getElementById('askAccessBtn')

if (errorBtn){
    errorBtn.addEventListener('click',()=>{
        globalThis.location.href="https://google.fr";
    });
}

if (askAccessBtn){
    askAccessBtn.addEventListener('click', async ()=>{
        const message = prompt('Entrez un message permettant d\'identifier la demande :')
        if (message !== null){
            const res = await fetch(
                '/api/settings/askTmpAuthorization',
                {
                    method:'POST',
                    body: JSON.stringify({
                        message: message
                    }),
                    headers:{
                        "Content-Type": 'application/json'
                    }
                }
            )
        }
    })
}