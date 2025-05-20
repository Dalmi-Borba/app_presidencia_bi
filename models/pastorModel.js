const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../database/calendar.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pastors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT
  )`);
});

exports.insertPastor = (name, phone, email) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO pastors (name, phone, email) VALUES (?, ?, ?)`,
      [name, phone || '', email || ''],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name FROM pastors ORDER BY name`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(r => r.name));
    });
  });
};

exports.getAllWithId = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, name, phone, email FROM pastors ORDER BY name`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM pastors WHERE id = ?`, [id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM pastors WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

exports.updateById = (id, nome, telefone, email) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE pastors SET name = ?, phone = ?, email = ? WHERE id = ?`,
      [nome, telefone, email, id],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};
