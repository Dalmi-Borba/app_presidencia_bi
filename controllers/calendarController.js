const { insertEvent, getAllCalendars, updateEventById, deleteEventById, getVisitsByRegion, getVisitsByCity } = require('../models/calendarModel');

exports.renderIndex = async (req, res) => {
  try {
    const events = await getAllCalendars();
    console.log('events', events);
    res.render('index', { events });
  } catch (err) {
    res.status(500).send("Erro ao carregar eventos");
  }
};


exports.createCalendar = async (req, res) => {
  const { id, title, date, type, pastor, church } = req.body;

  if (!title || !date || !type || !pastor || !church) {
    return res.status(400).send("Campos obrigatórios não preenchidos.");
  }

  try {
    if (id) {
      // Atualizar
      await updateEventById(id, title, date, pastor, church, type);
    } else {
      // Inserir
      await insertEvent(title, date, pastor, church, type);
    }

    res.redirect('/calendar/index');
  } catch (err) {
    res.status(500).send("Erro ao salvar evento: " + err.message);
  }
};


exports.deleteEvent = async (req, res) => {
  const id = req.params.id;
  try {
    await deleteEventById(id);
    res.redirect('/calendar/index');
  } catch (err) {
    res.status(500).send("Erro ao excluir evento: " + err.message);
  }
};

// BI

exports.visitsByRegion = async (req, res) => {
  const { start = '0000-01-01', end = '9999-12-31' } = req.query;
  try {
    const data = await getVisitsByRegion(start, end);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.renderMap = async (req, res) => {
  res.render('dashboard');
};


exports.visitsByCity = async (req, res) => {
  const { start='0000-01-01', end='9999-12-31' } = req.query;
  try {
    const data = await getVisitsByCity(start, end);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
};


exports.dashboard = async (req, res) => {
  const start = '0000-01-01', end = '9999-12-31';
  try {
    const visitsRegion = await getVisitsByRegion(start, end);
    const visitsCity   = await getVisitsByCity(start, end);
    res.render('dashboard', { visitsRegion, visitsCity });
  } catch (err) {
    res.status(500).send('Erro ao carregar dashboard: ' + err.message);
  }
};