import { DB as db } from './DB';

class GamesModel {
    constructor() {
        this.db = db.instance.db();
    }

    getAllGames() {
        let sql = `
        SELECT * 
        FROM games 
        ORDER BY name`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        });
    }

    getGame(id) {
        let sql = `
        SELECT * 
        FROM games 
        WHERE id = ?
        ORDER BY name`;

        db.get(sql, [id], (err, row) => {
            // process the row here
            if (err) {
                throw err;
            }
            return rows;
        });
    }

    insertGame(game) {
        // insert one row into the langs table
        let values = game.toListString();
        let sql = `
        INSERT INTO games(name, path, icon) 
        VALUES(?)`;

        db.run(sql, [values], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            return this.lastID
        });
    }

    updateGame(game) {

        let values = game.toJson();
        let sql = `
        UPDATE games
        SET name = (?)
            path = (?)
            icon = (?)
        WHERE
            id = (?)
        LIMIT 1`;

        db.run(sql, [values.name, values.path, values.icon, values.id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been updated with rowid ${this.lastID}`);
            return this.lastID
        });
    }

    deleteGame(id) {
        let sql = `
        DELETE FROM games
        WHERE id = (?)`;

        db.run(sql, [id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been deleted with rowid ${this.lastID}`);
            return this.lastID
        });
    }
}

export default GamesModel; 