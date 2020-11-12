const { ipcRenderer } = require('electron')

const events = {
    'games-page' : new Event('games-page'),
    'other-page' : new Event('other-page')
};

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(() => {
    let activePage = document.getElementById('games-page');
    includeSpecificHtml(activePage);

    let sideBarButtons = document.querySelectorAll('.sidebar-item');
    sideBarButtons.forEach(item => {
        item.addEventListener('click', event => {
            
        });
    });
});


document.addEventListener('games-page', function (e) { 
    ipcRenderer.invoke('games-page').then((data) => {
        
    });
    let addGame = document.getElementById('add-game');
    let addPath = document.getElementById('add-path');
       
    addGame.addEventListener('click', event => {    
        ipcRenderer.invoke('add-game').then((data) => {
            console.log(data);
        });
    });
    
    addPath.addEventListener('click', event => {    
        ipcRenderer.invoke('add-path').then((data) => {
            console.log(data);
        });
    }); 
}, false);
