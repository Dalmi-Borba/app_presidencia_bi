import express from 'express';
import configRoutes from './routes/configRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
dotenv.config();



import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// Configuração EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Configuração pasta public
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(config));

// Middleware para parsing do body das requisições
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/config', configRoutes);
app.use('/', calendarRoutes);
app.use('/register', registerRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
