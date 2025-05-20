const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const registerRoutes = require('./routes/registerRoutes');

const app = express();

// Configuração EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Configuração pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsing do body das requisições
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/', userRoutes);
app.use('/calendar', calendarRoutes);
app.use('/register', registerRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
