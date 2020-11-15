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
    let myGames = document.getElementById('myGames');

    let addGame = document.getElementById('add-game');
    let addGameModal = document.getElementById("add-game-modal");
    let addGameForm = document.getElementById('add-game-form');

    let fileInput = document.getElementById('file-path');
    let filePathButton = document.getElementById('file-select');

    let gameName = document.getElementById('game-name');

    let gameIconInput = document.getElementById('image-path');
    let gameIconButton = document.getElementById('image-select');
    let gameIconDisplay = document.getElementById('game-image');

    let getErrorRow = function(node){
        // input:after element then error-row element
        return node.nextSibling.nextSibling;
    }

    ipcRenderer.invoke('games-page').then((data) => {
        data.forEach(element => {
            let gameElm = document.createElement('DIV');
            gameElm.classList.add('game-row');
            gameElm.innerHTML += `
            <div class='game-icon' href='${element.path}'><img href='${element.path}' src='${element.icon}'/></div>
            <div class='game-name'>${element.name}</div>
            <button class='play-button' href='${element.path}'>Play</button>`

            myGames.appendChild(gameElm);
        });
        document.querySelectorAll('.game-icon, .play-button').forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                let path = event.target.attributes.href.value;
                ipcRenderer.invoke('play-game', path);
            });
        });
    });


    filePathButton.addEventListener('click', () => {
        ipcRenderer.invoke('game-file-select').then((data) => {
            fileInput.value = data.gamePath;
            gameIconInput.value = data.iconPath;
            gameIconDisplay.src = data.iconPath;
            gameName.value = data.gameName;

            getErrorRow(gameIconInput).textContent = '';
            
            getErrorRow(fileInput).textContent = '';
            gameName.style.background = 'initial';
        });
    });

    gameIconButton.addEventListener('click', () => {
        ipcRenderer.invoke('game-icon-select').then((data) => {
            gameIconDisplay.src = data;
            gameIconInput.value = data;
            getErrorRow(gameIconInput).textContent = '';
        });
    });

    gameName.addEventListener('keydown', (event) => {
        gameName.style.background = 'initial';
        getErrorRow(gameName).textContent = '';
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

        let iconPath = gameIconInput.value;
        let name = gameName.value;
        let gamePath = fileInput.value;

        if(!iconPath){
            getErrorRow(gameIconInput).textContent = 'Please select an icon';
        }
        if(!name){
            getErrorRow(gameName).textContent = "Please provide a name";
            gameName.style.background = 'rgb(224 142 150)';
        }
        if(!gamePath){
            getErrorRow(fileInput).textContent = 'Please select an exe file path';
        }
        if(iconPath && name && gamePath){
            ipcRenderer.invoke('add-game', {'gameName': name, 'iconPath': iconPath, 'gamePath': gamePath}).then((data) => {
                let gameElm = document.createElement('DIV');
                gameElm.classList.add('game-row');
                gameElm.innerHTML += `
                <div class='game-icon' href='${gamePath}'><img class='game-icon-img' href='${gamePath}' src='${iconPath}'/></div>
                <div class='game-name'>${name}</div>
                <button class='play-button' href='${gamePath}'>Play</button>`
                myGames.appendChild(gameElm);

                gameElm.addEventListener('click', (event) => {
                    targetClass = event.target.className
                    if(targetClass == 'play-button' ||  targetClass == 'game-icon' || targetClass == 'game-icon-img'){
                        event.preventDefault();
                        event.stopPropagation();
                        let path = event.target.attributes.href.value;
                        ipcRenderer.invoke('play-game', path);
                    }
                });
                addGameModal.style.display = "none";
            });
        }
    });
}, false);

