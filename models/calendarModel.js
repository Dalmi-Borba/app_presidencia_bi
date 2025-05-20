const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database/calendar.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    data TEXT NOT NULL,
    pastor TEXT NOT NULL,
    igreja TEXT NOT NULL,
    tipo TEXT NOT NULL
  )`);
  });

exports.getAllCalendars = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, titulo AS title, data AS start, pastor, igreja AS church, tipo
       FROM eventos`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

exports.insertEvent = (titulo, data, pastor, igreja, tipo) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO eventos (titulo, data, pastor, igreja, tipo) VALUES (?, ?, ?, ?, ?)`,
      [titulo, data, pastor, igreja, tipo],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};


exports.updateEventById = (id, title, date, pastor, church, type) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE eventos SET titulo = ?, data = ?, pastor = ?, igreja = ?, tipo = ? WHERE id = ?`,
      [title, date, pastor, church, type, id],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

exports.deleteEventById = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM eventos WHERE id = ?`, [id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// bi
exports.getVisitsByRegion = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.church_region AS region,
              COUNT(*) AS count,
              MAX(e.data) AS last_visit
       FROM eventos e
       JOIN churches c
         ON e.igreja = c.church_name
       WHERE e.tipo = 'visita'
         AND e.data BETWEEN ? AND ?
       GROUP BY c.church_region
       ORDER BY count DESC`,
      [startDate, endDate],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
};

// model
exports.getVisitsByCity = (startDate, endDate) => {
  return new Promise((res, rej) => {
    db.all(
      `SELECT igreja AS city,
              COUNT(*) AS count,
              MAX(data) AS last_visit
       FROM eventos
       WHERE tipo = 'visita'
         AND data BETWEEN ? AND ?
       GROUP BY igreja`,
      [startDate, endDate],
      (err, rows) => err ? rej(err) : res(rows)
    );
  });
};

exports.getVisitsByCity = (startDate, endDate) => {
  return new Promise((res, rej) => {
    db.all(
      `SELECT igreja AS city,
              COUNT(*) AS count,
              MAX(data) AS last_visit
       FROM eventos
       WHERE tipo = 'visita'
         AND data BETWEEN ? AND ?
       GROUP BY igreja`,
      [startDate, endDate],
      (err, rows) => err ? rej(err) : res(rows)
    );
  });
};


