import {DB as db} from './DB';

class PathsModel {
    constructor() {
        this.db = db.instance.db();
    }

    getPaths() {
        return new Promise((resolve, reject) => {
            let sql = `
            SELECT * 
            FROM paths 
            ORDER BY path`;
            this.db.all(sql, (err, row) => {
                if (err) {
                    reject(err); // optional: you might choose to swallow errors.
                } else {
                    resolve(row); // accumulate the data
                }
            });
        });
    }

    insertPath(path) {
        let sql = `
        INSERT INTO paths(path) 
        VALUES(?)`;

        var lastId = this.db.run(sql, [path], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            return this.lastID;
        });
    }

    deletePath(id) {
        let sql = `
        DELETE FROM paths
        WHERE id = (?)`;

        this.db.run(sql, [id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been deleted with rowid ${this.lastID}`);
            return this.lastID
        });
    }
}
export default PathsModel;