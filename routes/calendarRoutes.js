//routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/index', calendarController.renderIndex);
router.post('/eventos/add', calendarController.createCalendar);

router.get('/eventos/delete/:id', calendarController.deleteEvent);
router.get('/api/visits-region', calendarController.visitsByRegion);
router.get('/api/visits-city', calendarController.visitsByCity);
//router.get('/map', calendarController.renderMap); 
router.get('/dashboard', calendarController.dashboard);


//router.post('/add', calendarController.createcalendar);
//router.get('/edit/:id', calendarController.getcalendarById);
//router.post('/edit/:id', calendarController.updatecalendar);
//router.get('/delete/:id', calendarController.deletecalendar);

module.exports = router;