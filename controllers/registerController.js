const PastorModel = require('../models/pastorModel');
const ChurchModel = require('../models/churchModel');

exports.renderRegister = async (req, res) => {
  const pastors = await PastorModel.getAllWithId();
  const churches = await ChurchModel.getAllWithId();

  let editPastor = null;
  if (req.query.editPastorId) {
    editPastor = await PastorModel.findById(req.query.editPastorId);
  }

  let editChurch = null;
  if (req.query.editChurchId) {
    editChurch = await ChurchModel.findById(req.query.editChurchId);
  }

  res.render('register', { pastors, churches, editPastor, editChurch });
};


exports.createPastor = async (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome) {
    return res.status(400).send('Nome do pastor é obrigatório.');
  }

  try {
    await PastorModel.insertPastor(nome, telefone, email);
    res.redirect('/register/index');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar pastor: ' + error.message);
  }
};

exports.createChurch = async (req, res) => {
  const { nome, cidade } = req.body;

  if (!nome || !cidade) {
    return res.status(400).send('Nome e cidade da igreja são obrigatórios.');
  }

  try {
    await ChurchModel.insertChurch(nome, cidade);
    res.redirect('/register/index');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar igreja: ' + error.message);
  }
};

exports.listPastors = async (req, res) => {
  try {
    const data = await PastorModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listChurches = async (req, res) => {
  try {
    const data = await ChurchModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePastor = async (req, res) => {
  await PastorModel.deleteById(req.params.id);
  res.redirect('/register/index');
};

exports.deleteChurch = async (req, res) => {
  await ChurchModel.deleteById(req.params.id);
  res.redirect('/register/index');
};

exports.updatePastor = async (req, res) => {
  const { nome, telefone, email } = req.body;
  await PastorModel.updateById(req.params.id, nome, telefone, email);
  res.redirect('/register/index');
};

exports.updateChurch = async (req, res) => {
  const { nome, cidade } = req.body;
  await ChurchModel.updateById(req.params.id, nome, cidade);
  res.redirect('/register/index');
};

