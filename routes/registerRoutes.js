const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.get('/index', registerController.renderRegister);
router.post('/pastores', registerController.createPastor);
router.post('/igrejas', registerController.createChurch);
router.get('/api/pastores', registerController.listPastors);
router.get('/api/igrejas', registerController.listChurches);
router.get('/pastores/delete/:id', registerController.deletePastor);
router.get('/igrejas/delete/:id', registerController.deleteChurch);
router.post('/pastores/edit/:id', registerController.updatePastor);
router.post('/igrejas/edit/:id', registerController.updateChurch);

module.exports = router;
