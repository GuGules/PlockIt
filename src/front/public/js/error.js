let errorBtn = document.getElementById('degageBtn')
let goBoardBtn = document.getElementById('goBoardBtn')

if (errorBtn){
    errorBtn.addEventListener('click',()=>{
        globalThis.location.href="https://google.fr";
    });
}

if (goBoardBtn){
    goBoardBtn.addEventListener('click',()=>{
        globalThis.location.pathname="/";
    })
}