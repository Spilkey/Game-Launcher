const sqlite3 = require('sqlite3').verbose();

const {settingsPath} = require('../middleware/paths')


const DB = {
    _instance: null,
    get instance() {
      if (!this._instance) {
        this._instance = {
          db() {
            let db = new sqlite3.Database(`${settingsPath}\\games.db`, (err) => {
                if (err) {
                    console.error(err.message);
                  }
                console.log('Connected to the chinook database.');
                db.all("select name from sqlite_master where type='table'", (err, tables) => {
                    console.log(tables);
                    let tablesArray = tables.map(element => element.name);
                    console.log(tablesArray);
                    if( tablesArray.indexOf('games') == -1){
                        db.run('CREATE TABLE games(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, path TEXT, icon TEXT)');
                    }
                    if(tablesArray.indexOf('paths') == -1){
                        db.run('CREATE TABLE paths(id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT)');
                    }
                });
            });
            return db;
          },
  
          _type: 'DB',
  
          get type() {
            return this._type;
          },
  
          set type(value) {
            this._type = value;
          }
        };
      }
      return this._instance;
    }
  };

exports.db = DB;