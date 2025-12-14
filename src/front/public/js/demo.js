const links = document.getElementById("links_demo");

function addDemoLinks(){
    links.innerHTML += `<li><a href="${window.location.origin}/vote/demo">Page de vote</a></li>`;
    links.innerHTML += `<li><a href="${window.location.origin}/contribute/demo">Page de contribution</a></li>`;
}

addDemoLinks();