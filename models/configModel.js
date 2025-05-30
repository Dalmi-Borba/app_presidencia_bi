//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('./database/database.sqlite');
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, process.env.DB_PATH));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`);
});

export function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export function addUser(user) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    stmt.run([user.name, user.email], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
    stmt.finalize();
  });
};

export function updateUser(id, user) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
    stmt.run([user.name, user.email, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    stmt.finalize();
  });
};

export function deleteUser(id) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(id, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    stmt.finalize();
  });
};
