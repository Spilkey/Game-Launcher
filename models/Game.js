
class Game {
    constructor(name, path, icon, id = null) {
        this._id = id;
        this._name = name;
        this._path = path;
        this._icon = icon;
    }

    toList() {
        return [this._name, this._path, this._icon];
    }

    toListString() {
        return `${this._name}, ${this._path}, ${this._icon}`
    }

    toJson() {
        return {
            'id': this._id,
            'name': this._name,
            'path': this._path,
            'icon': this._icon
        }
    }
}

export default Game;
