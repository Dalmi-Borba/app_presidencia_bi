//const sqlite3 = require('sqlite3').verbose();
//const path = require('path');
//const db = new sqlite3.Database(path.join(__dirname, '../database/calendar.sqlite'));
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
  db.run(`CREATE TABLE IF NOT EXISTS pastors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT
  )`);
});

export function insertPastor(name, phone, email) {
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

export function getAll() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name FROM pastors ORDER BY name`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(r => r.name));
    });
  });
};

export function getAllWithId() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, name, phone, email FROM pastors ORDER BY name`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export function deleteById(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM pastors WHERE id = ?`, [id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

export function findById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM pastors WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export function updateById(id, nome, telefone, email) {
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
