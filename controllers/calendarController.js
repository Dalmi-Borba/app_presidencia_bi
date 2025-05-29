import { auth } from 'express-openid-connect';
import PDFDocument from 'pdfkit';
import {
  insertEvent,
  getAllCalendars,
  updateEventById,
  deleteEventById,
  getVisitsByRegion,
  getVisitsByCity,
  getEventById,
  filterEvents,
  getEventsByDateRange
} from '../models/calendarModel.js';

import { getAll as getAllPastors } from '../models/pastorModel.js';
import { getAll as getAllChurches } from '../models/churchModel.js';

export async function renderIndex(req, res) {
  try {
    const events = await getAllCalendars();
    const churches = await getAllChurches();
    const pastors = await getAllPastors();

    const user = req.oidc.user  || { name: 'seja bem vindo' };
    const role = res.locals.role || 'user';  

    res.render('index', { events, user: user.name, role, churches, pastors });
  } catch (err) {
    res.status(500).send("Erro ao carregar eventos");
  }
}

export async function createCalendar(req, res) {
  const { id, date, type_envent, pastor, church, observation } = req.body;
  console.log(req.body);
  if (!date || !type_envent || !pastor) {
    return res.status(400).send("Campos obrigatórios não preenchidos.");
  }

  try {
    if (id) {
      await updateEventById(id, date, pastor, church, type_envent, observation);
    } else {
      await insertEvent(date, pastor, church, type_envent, observation);
    }

    res.redirect('/calendar/eventos/list');
  } catch (err) {
    res.status(500).send("Erro ao salvar evento: " + err.message);
  }
}

export async function deleteEvent(req, res) {
  const id = req.params.id;
  try {
    await deleteEventById(id);
    res.redirect('/calendar/index');
  } catch (err) {
    res.status(500).send("Erro ao excluir evento: " + err.message);
  }
}

export async function visitsByRegion(req, res) {
  const { start = '0000-01-01', end = '9999-12-31' } = req.query;
  try {
    const date = await getVisitsByRegion(start, end);
    res.json(date);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function renderMap(req, res) {
  res.render('dashboard');
}

export async function listCalendar(req, res) {
  try {
    const events = await getAllCalendars();

    res.render('listCalendar', { events });
  } catch (err) {
    res.status(500).send("Erro ao carregar eventos");
  }
}

export async function calendar(req, res) {
  try {
    const events = await getAllCalendars();
    const user = req.oidc.user  || { name: 'Não logado' };
    const role = res.locals.role || 'user'; 

    res.render('calendar', { events, user: user.name, role });
  } catch (err) {
    res.status(500).send("Erro ao carregar eventos");
  }
}

export async function calendarEdit(req, res) {
  try {
    const event = await getEventById(req.params.id);
    const churches = await getAllChurches();
    const pastors = await getAllPastors();

    const user = req.oidc.user  || { name: 'Não logado' };
    const role = res.locals.role || 'user';  
    
    res.render('calendarEdit', { event, user: user.name, role, churches, pastors });
  } catch (err) {
    res.status(500).send("Erro ao carregar eventos");
  }
}

export async function filterCalendar(req, res) {
  try {
    const churches = await getAllChurches();
    const pastors = await getAllPastors();

    const user = req.oidc.user  || { name: 'Não logado' };
    const role = res.locals.role || 'user';  
    
    res.render('filterCalendar', { user: user.name, role, churches, pastors });
  } catch (err) {
    res.status(500).send("Erro ao carregar eventos");
  }
}

//função não está em uso
export async function updateCalendar(req, res) {
  const { id, date, type_envent, pastor, church, observation } = req.body;

  if (!id || !type_envent || !pastor || !church) {
    return res.status(400).send("Campos obrigatórios não preenchidos.");
  }

  try {
      await updateEventById(id, date, pastor, church, type_envent, observation);

      res.redirect('/calendar/index');
    
  } catch (err) {
    res.status(500).send("Erro ao salvar evento: " + err.message);
  }
}

export async function visitsByCity(req, res) {
  const { start = '0000-01-01', end = '9999-12-31' } = req.query;
  try {
    const date = await getVisitsByCity(start, end);
    res.json(date);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function dashboard(req, res) {
  const start = '0000-01-01', end = '9999-12-31';
  try {
    const visitsRegion = await getVisitsByRegion(start, end);
    const visitsCity   = await getVisitsByCity(start, end);
    res.render('dashboard', { visitsRegion, visitsCity });
  } catch (err) {
    res.status(500).send('Erro ao carregar dashboard: ' + err.message);
  }
}


export async function searchCalendar(req, res) {
  try {
    const { date, type_envent, pastor, church, observation } = req.body;
    const filters = { date, type_envent, pastor, church, observation };
    const rows = await filterEvents(filters);

    res.render('listCalendar', { events: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function exportCalendar(req, res) {
  res.render('exportCalendar');
}

export async function exportQuarterlyReport(req, res) {
  try {
    const year    = parseInt(req.params.year,   10);
    const quarter = parseInt(req.params.quarter, 10);
    if (![1,2,3,4].includes(quarter)) {
      return res.status(400).send('Trimestre inválido (use 1–4).');
    }

    // --- calcula intervalo de datas ---
    const monthStart = [1,4,7,10][quarter - 1];
    const monthEnd   = monthStart + 2;
    const pad = n => String(n).padStart(2,'0');
    const startDate = `${year}-${pad(monthStart)}-01`;
    const lastDay   = new Date(year, monthEnd, 0).getDate();
    const endDate   = `${year}-${pad(monthEnd)}-${pad(lastDay)}`;

    // --- busca eventos ---
    const rows = await getEventsByDateRange(startDate, endDate);

    // --- cria PDF ---
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio_${year}_Q${quarter}.pdf`
    );
    doc.pipe(res);

    // título
    doc
      .fontSize(16)
      .text(`Relatório Itinerário — Q${quarter} ${year}`, {
        align: 'center'
      })
      .moveDown(1);

    // layout de tabela
    const marginLeft    = doc.page.margins.left;
    const tableTop      = doc.y;
    const rowHeight     = 20;
    const colWidths     = {
      date:   70,
      pastor: 120,
      church: 100,
      type:    80,
      note:   doc.page.width - marginLeft*2 - (70+120+100+80)
    };

    // cabeçalho
    doc.font('Helvetica-Bold').fontSize(10);
    let xPos = marginLeft;
    Object.entries(colWidths).forEach(([key, width], i) => {
      const label = ['Data','Obreiro(a)','Distrito','Tipo','Observação'][i];
      doc
        .rect(xPos, tableTop - 2, width, rowHeight)
        .fillOpacity(0.1)
        .fillAndStroke('#CCCCCC', '#999999')
        .fillOpacity(1)
        .fillColor('black')
        .text(label, xPos + 4, tableTop + 4, {
          width: width - 8,
          align: 'left'
        });
      xPos += width;
    });

    // volta ao texto normal
    let yPos = tableTop + rowHeight;
    doc.font('Helvetica').fontSize(9);

    // linhas de dados
    rows.forEach(ev => {
      // quebra de página
      if (yPos > doc.page.height - rowHeight - doc.page.margins.bottom) {
        doc.addPage();
        yPos = doc.page.margins.top;
      }

      xPos = marginLeft;

      // parse local date sem fuso
      const [yy, mm, dd] = ev.date.split('-').map(Number);
      const dateStr = new Date(yy, mm - 1, dd).toLocaleDateString('pt-BR');

      const cells = [
        dateStr,
        ev.pastor,
        ev.church,
        ev.type_envent,
        ev.observation || ''
      ];

      cells.forEach((text, i) => {
        const width = Object.values(colWidths)[i];
        // desenha borda da célula
        doc
          .rect(xPos, yPos - 2, width, rowHeight)
          .stroke();
        // insere texto com elipse se necessário
        doc.text(text, xPos + 4, yPos + 2, {
          width: width - 8,
          height: rowHeight - 4,
          ellipsis: true
        });
        xPos += width;
      });

      yPos += rowHeight;
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar PDF: ' + err.message);
  }
}
