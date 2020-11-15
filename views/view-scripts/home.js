const { ipcRenderer } = require('electron')

const events = {
    'games-page': new Event('games-page'),
    'other-page': new Event('other-page')
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

    let editBtn = document.querySelector('#edit-game');
    let addBtn = document.querySelector('#submit-game');

    let getErrorRow = function (node) {
        // input:after element then error-row element
        return node.nextSibling.nextSibling;
    }

    ipcRenderer.invoke('games-page').then((data) => {
        data.forEach(element => {
            let gameElm = document.createElement('DIV');
            gameElm.classList.add('game-row');
            gameElm.id = element.id;
            gameElm.innerHTML += `
            <div class='game-icon' href='${element.path}'><img href='${element.path}' src='${element.icon}'/></div>
            <div class='game-name'>${element.name}</div>
            <i class="fa fa-pencil" aria-hidden="true"></i>
            <i class="fa fa-trash" aria-hidden="true"></i>
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
        document.querySelectorAll('.fa-trash').forEach((element) => {
            element.addEventListener('click', (event) => {
                deleteEvent(event);
            });
        });
        document.querySelectorAll('.fa-pencil').forEach((element) => {
            element.addEventListener('click', (event) => {
                initUpdateModal(event);
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
        span.onclick = function () {
            addGameModal.style.display = "none";
        }

        addGame.addEventListener('click', event => {
            addGameModal.style.display = 'block';
            editBtn.style.display = 'none';
            addBtn.style.display = 'block';
        });


        addGameForm.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();

            let values = getGameFormFields();

            if (validateGameForm(values.iconPath, values.name, values.gamePath)) {
                ipcRenderer.invoke('add-game', { 'gameName': values.name, 'iconPath': values.iconPath, 'gamePath': values.gamePath }).then((data) => {
                    let gameElm = document.createElement('DIV');
                    gameElm.classList.add('game-row');
                    gameElm.id = data.id;
                    gameElm.innerHTML += `
                    <div class='game-icon' href='${values.gamePath}'><img class='game-icon-img' href='${values.gamePath}' src='${values.iconPath}'/></div>
                    <div class='game-name'>${values.name}</div>
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    <button class='play-button' href='${values.gamePath}'>Play</button>`
                    myGames.appendChild(gameElm);

                    gameElm.addEventListener('click', (event) => {
                        targetClass = event.target.className
                        if (targetClass == 'play-button' || targetClass == 'game-icon' || targetClass == 'game-icon-img') {
                            event.preventDefault();
                            event.stopPropagation();
                            let path = event.target.attributes.href.value;
                            ipcRenderer.invoke('play-game', path);
                        }else if(targetClass == "fa-pencil"){
                            initUpdateModal(event);
                        }else if(targetClass == 'fa-trash'){
                            deleteEvent(event);
                        }
                    });
                    addGameModal.style.display = "none";
                });
            }
        });

        function validateGameForm(iconPath, name, gamePath) {

            if (!iconPath) {
                getErrorRow(gameIconInput).textContent = 'Please select an icon';
            }
            if (!name) {
                getErrorRow(gameName).textContent = "Please provide a name";
                gameName.style.background = 'rgb(224 142 150)';
            }
            if (!gamePath) {
                getErrorRow(fileInput).textContent = 'Please select an exe file path';
            }
            return iconPath && name && gamePath;
        }

        function getGameFormFields() {
            let iconPath = gameIconInput.value;
            let name = gameName.value;
            let gamePath = fileInput.value;

            return { iconPath: iconPath, name: name, gamePath: gamePath }
        }

        function initUpdateModal(event){
            let target = event.target;
            let row = target.parentNode;
            let id = row.id;

            let edit = new Promise((resolve, reject) => {
                editBtn.style.display = 'block';
                addBtn.style.display = 'none';
                addGameModal.style.display = 'block';

                ipcRenderer.invoke('get-game', id).then((data) => {
                    fileInput.value = data.path;
                    gameIconInput.value = data.icon;
                    gameIconDisplay.src = data.icon;
                    gameName.value = data.name;
                });
                editBtn.removeEventListener('click', () => { });
                editBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    let values = getGameFormFields();

                    if (validateGameForm(values.iconPath, values.name, values.gamePath)) {
                        ipcRenderer.invoke('update-game', {
                            'id': id,
                            'gameName': values.name,
                            'iconPath': values.iconPath,
                            'gamePath': values.gamePath
                        }).then((data) => {
                            let childs = row.children;
                            childs[0].attributes.href = data.path;
                            childs[0].firstChild.attributes.href = data.path;
                            childs[0].firstChild.attributes.src = data.icon;
                            childs[1].innerHTML = data.name;
                            childs[4].attributes.href = data.path;

                            addGameModal.style.display = 'none';
                         });
                    }
                })
            });
        }

        function deleteEvent(event){
            let target = event.target;
            let row = target.parentNode;
            let id = row.id;
            ipcRenderer.invoke('delete-game', id).then((data) => {
                let mainCont = row.parentNode;
                mainCont.removeChild(row);
            });
        }

    }, false);
});