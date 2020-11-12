const sqlite3 = require('sqlite3').verbose();

const {settingsPath} = require('../middleware/paths')


class DB {
    db;
    get db(){
        if(db){
            return this.db;
        }else{
            db = new sqlite3.Database(`${settingsPath}\\games.db`, (err) => {
                if (err) {
                    console.error(err.message);
                  }
                console.log('Connected to the chinook database.');
                db.run('CREATE TABLE games(id PRIMARY KEY AUTOINCREMENT, name TEXT, path TEXT, icon TEXT)');
                db.run('CREATE TABLE paths(id PRIMARY KEY AUTOINCREMENT, path TEXT)');
            });
            return this.db;
        }
    }
}

exports.db = DB;