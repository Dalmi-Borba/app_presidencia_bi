//const sqlite3 = require('sqlite3').verbose();
//const path = require('path');
//const db = new sqlite3.Database(path.join(__dirname, '../database/calendar.sqlite'));
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, '../database/calendar.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS churches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    church_name TEXT NOT NULL,
    church_region TEXT NOT NULL
  )`);
});

export function insertChurch(church_name, church_region) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO churches (church_name, church_region) VALUES (?, ?)`,
      [church_name, church_region || ''],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

export function getAll() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT church_name FROM churches ORDER BY church_name`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(r => r.church_name));
    });
  });
};

export function getAllWithId() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, church_name, church_region FROM churches ORDER BY church_name`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export function deleteById(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM churches WHERE id = ?`, [id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

export function findById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM churches WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export function updateById(id, nome, cidade) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE churches SET church_name = ?, church_region = ? WHERE id = ?`,
      [nome, cidade, id],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};