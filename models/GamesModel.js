import DB from './DB';

class GamesModel {
    constructor() {
        this.db = DB.instance.db();
    }

    getAllGames() {
        return new Promise((reslove, reject) => {
            let sql = `
            SELECT * 
            FROM games 
            ORDER BY name`;
    
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                reslove(rows);
            });
        });
    }

    getAllGameNames() {
        return new Promise((reslove, reject) => {
            let sql = `
            SELECT name 
            FROM games 
            ORDER BY name`;
    
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                reslove(rows);
            });
        });
    }

    getGame(id) {
        let sql = `
        SELECT * 
        FROM games 
        WHERE id = ?
        ORDER BY name`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                // process the row here
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });

    }

    insertGame(game) {
        // insert one row into the langs table
        let values = game.toList();
        let sql = `
        INSERT INTO games(name, path, icon) 
        VALUES(?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (err) {
                if (err) {
                    reject(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                resolve(this.lastID);
            });
        });
    }

    updateGame(game) {
        let values = game.toJson();
        let sql = `
        UPDATE games
        SET name = ?,
            path = ?,
            icon = ?
        WHERE
            id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [values.name, values.path, values.icon, values.id], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been updated with rowid ${values.id}`);
                resolve(values.id);
            });
        });
    }

    deleteGame(id) {
        let sql = `
        DELETE FROM games
        WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function (err, data) {
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been deleted with rowid ${id}`);
                resolve(id);
            });
        });

    }
}

export default GamesModel; 
