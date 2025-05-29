import express from 'express';
import {
  renderRegister,
  createPastor,
  createChurch,
  listPastors,
  listChurches,
  deletePastor,
  deleteChurch,
  updatePastor,
  updateChurch
} from '../controllers/registerController.js';
import authMidleware from '../middleware/authMiddleware.js';

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

router.get('/index', renderRegister);
router.post('/pastores', createPastor);
router.post('/igrejas', createChurch);
router.get('/api/pastores', listPastors);
router.get('/api/igrejas', listChurches);
router.get('/pastores/delete/:id', deletePastor);
router.get('/igrejas/delete/:id', deleteChurch);
router.post('/pastores/edit/:id', updatePastor);
router.post('/igrejas/edit/:id', updateChurch);


export default router;
