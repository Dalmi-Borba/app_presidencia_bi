import express from 'express';
import {
  renderIndex,
  createCalendar,
  deleteEvent,
  visitsByRegion,
  visitsByCity,
  dashboard,
  listCalendar,
  calendar,
  calendarEdit, 
  updateCalendar,
  filterCalendar,
  searchCalendar,
  exportQuarterlyReport, 
  exportCalendar
} from '../controllers/calendarController.js';
import authMidleware from '../middleware/authMiddleware.js';
import logger from '../helpers/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.use(authMidleware);
const ADMINS = (process.env.ADMIN_NAMES || '')
  .split(',')
  .map(s => s.trim().toUpperCase())
  .filter(Boolean);

router.use((req, res, next) => {
  const user = req.oidc.user || {};
  res.locals.user = user;

  const identifier = (user.name || '')
    .toUpperCase();
  
  const isAdmin = ADMINS.includes(identifier);

  res.locals.role = isAdmin ? 'admin' : 'user';
  next();
});

router.use((req, res, next) => {
  const { method, originalUrl: url } = req;
  const { user } = res.locals.user;
  const meta = { method, url, user };

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    meta.body = req.body;
  }

  logger.info(meta);
  next();
});


router.get('/index', renderIndex);
router.get('/eventos/list', listCalendar);
router.get('/eventos/calendar', calendar);
router.get('/eventos/edit/:id', calendarEdit);
router.get('/eventos/filter', filterCalendar);
router.get('/eventos/export/:year/:quarter', exportQuarterlyReport);
router.post('/eventos/add', createCalendar);
router.get('/eventos/export', exportCalendar);
router.post('/eventos/search', searchCalendar);
//router.post('/eventos/update', updateCalendar);
router.get('/eventos/delete/:id', deleteEvent);
router.get('/api/visits-region', visitsByRegion);
router.get('/api/visits-city', visitsByCity);
router.get('/dashboard', dashboard);


//http://localhost:3000/calendar/eventos/edit?id=2

export default router;