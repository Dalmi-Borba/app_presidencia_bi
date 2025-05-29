//const sqlite3 = require('sqlite3').verbose();
//const path = require('path');
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, '../database/calendar.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    pastor TEXT NOT NULL,
    church TEXT NOT NULL,
    type_envent TEXT NOT NULL,
    observation TEXT
  )`);
  });

/**
 * titulo = destivado
 * data = data
 * pastor = pastor = obreiro
 * igreja = distrito
 * tipo = ocasião
 * 
 */

export function getAllCalendars() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, date, pastor, church, type_envent,observation
       FROM eventos`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export function insertEvent(date, pastor, church, type_envent, observation) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO eventos (date, pastor, church, type_envent, observation) VALUES (?, ?, ?, ?, ?)`,
      [date, pastor, church, type_envent, observation],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};


export function updateEventById(id, date, pastor, church, type_envent, observation) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE eventos SET titulo = ?, data = ?, pastor = ?, church = ?, type_envent = ?, observation = ? WHERE id = ?`,
      [date, pastor, church, type_envent, observation, id],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export function deleteEventById(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM eventos WHERE id = ?`, [id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// bi
export function getVisitsByRegion(startDate, endDate) {
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

// bi
export function getVisitsByCity(startDate, endDate) {
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

export function getEventById(id) {
  return new Promise((res, rej) => {
    db.get(
      `SELECT * FROM eventos WHERE id = ?`,
      [id],
      (err, row) => err ? rej(err) : res(row)
    );
  });
};

export function filterEvents(filters) {
  //{ date: '', type: '', pastor: 'YASNA LIZ', church: '', title: '' }
  return new Promise((resolve, reject) => {
    const conditions = [];
    const params     = [];

    if (filters.date) {
      conditions.push(`date = ?`);
      params.push(filters.date);
    }
    if (filters.type_envent) {
      conditions.push(`type_envent = ?`);
      params.push(filters.type_envent);
    }
    if (filters.pastor) {
      conditions.push(`pastor = ?`);
      params.push(filters.pastor);
    }
    if (filters.church) {
      conditions.push(`church = ?`);
      params.push(filters.church);
    }

    // monta cláusula WHERE (ou retorna tudo se nenhum filtro)
    const where = conditions.length
      ? 'WHERE ' + conditions.join(' AND ')
      : '';

    const sql = `
      SELECT
        id,
        date,
        pastor,
        church,
        type_envent,
        observation
      FROM eventos
      ${where}
    `;

    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// calendarModel.js

/**
 * Retorna todos os eventos cuja data está entre startDate e endDate (inclusive)
 * @param {string} startDate — 'YYYY-MM-DD'
 * @param {string} endDate   — 'YYYY-MM-DD'
 */
export function getEventsByDateRange(startDate, endDate) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id,
        date,
        pastor,
        church,
        type_envent,
        observation
      FROM eventos
      WHERE date(date) BETWEEN date(?) AND date(?)
      ORDER BY date
    `;
    db.all(sql, [startDate, endDate], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
