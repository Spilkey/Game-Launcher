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
        console.log(data);
        let myGames = document.getElementById('myGames');
        data.forEach(element => {
            let gameElm = document.createElement('DIV');
            gameElm.classList.add('game-row');
            gameElm.innerHTML += `
            <div class='game-icon'><img src='${element.icon}'/></div>
            <div class='game-name'>${element.name}</div>
            <button class='play-button'><a href='${element.path}'>Play</a></button>`

            myGames.appendChild(gameElm);
        });
    });
    let addGame = document.getElementById('add-game');
    let addGameModal = document.getElementById("add-game-modal");
    let addGameForm = document.getElementById('add-game-form');

    let fileInput = document.getElementById('file-path');
    let filePathButton = document.getElementById('file-select');

    let gameName = document.getElementById('game-name');

    let gameIconInput = document.getElementById('image-path');
    let gameIconButton = document.getElementById('image-select');
    let gameIconDisplay = document.getElementById('game-image');

    filePathButton.addEventListener('click', () => {
        ipcRenderer.invoke('game-file-select').then((data) => {
            fileInput.value = data.gamePath;
            gameIconInput.value = data.iconPath;
            gameIconDisplay.src = data.iconPath;
            gameName.value = data.gameName;
        });
    });

    gameIconButton.addEventListener('click', () => {
        ipcRenderer.invoke('game-icon-select').then((data) => {
            gameIconDisplay.src = data;
            gameIconInput.value = data;
        });
    });

    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        addGameModal.style.display = "none";
    }
       
    addGame.addEventListener('click', event => { 
        addGameModal.style.display = 'block';

        
    });

    addGameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        let filePath = addGameForm.elements.namedItem('file-path').value;
        let imagePath = addGameForm.elements.namedItem('image-path').value;

        
        ipcRenderer.send('add-game', ).then((data) => {
            console.log(data);
            steamLoginModal.style.display = "none";
        });
    });
}, false);
