const id = globalThis.location.pathname.split('/')[2];

const report = document.getElementById('report');
const backBtn = document.getElementById('backButton');
const ddlExcelReportBtn = document.getElementById('ddlExcelReportBtn');
const ddlJsonReportBtn = document.getElementById('ddlJsonReportBtn');

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

function loadReport() {
    fetch(`/api/board/campaigns/${id}/votes`).then((res) => {
        res.json().then((items) => {
            items.forEach((item) => {
                report.innerHTML += `<div class="card ${colors[item.color]}"><div class="card-body"><h5 class="card-title">${item.content}</h5><p class="card-text">Votes : ${item.votes}</p></div></div><div class="separator"></div>`
            });
        })
    })
}

function downloadFromBuffer(buffer, filename, mimeType = 'application/octet-stream') {
    // Crée un blob à partir du buffer
    const blob = new Blob([buffer], { type: mimeType });

    // Crée une URL temporaire pour le blob
    const url = URL.createObjectURL(blob);

    // Crée un lien "invisible" et déclenche le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Nettoyage
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        globalThis.location.href = `/${id}`;
    });
}

loadReport();

ddlExcelReportBtn.addEventListener('click', async () => {
    const res = await fetch(`/api/board/campaigns/${id}/exportRapportExcel`);
    if (res.ok) {
        const data = await res.json();
        downloadFromBuffer(new Uint8Array(data.buffer.data).buffer, data.filename)
    } else {
        alert("Quelque chose n'a pas été lors de la récupération du fichier excel")
    }
})
ddlJsonReportBtn.addEventListener('click', async ()=>{
        const res = await fetch(`/api/board/campaigns/${id}/exportRapportJson`);
    if (res.ok) {
        const data = await res.json();
        downloadFromBuffer(new Uint8Array(data.buffer.data).buffer, data.filename)
    } else {
        alert("Quelque chose n'a pas été lors de la récupération du fichier json")
    }
})