// logger.js
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import pino from 'pino'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// pasta de logs
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

// destinations do Pino: app.log e error.log
const streams = [
  { level: 'info',  stream: fs.createWriteStream(path.join(logsDir, 'app.log'),   { flags: 'a' }) },
  { level: 'error', stream: fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' }) },
]

// instancia o logger Pino
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
}, pino.multistream(streams))

export default logger
