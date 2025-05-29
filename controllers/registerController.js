import {
  insertPastor,
  getAll,
  getAllWithId,
  deleteById,
  findById,
  updateById
} from '../models/pastorModel.js';

import {
  insertChurch,
  getAll as getAllChurches,
  getAllWithId as getAllChurchesWithId,
  deleteById as deleteChurchById,
  findById as findChurchById,
  updateById as updateChurchById
} from '../models/churchModel.js';


export async function renderRegister(req, res) {
  const pastors = await getAllWithId();
  const churches = await getAllChurchesWithId();

  let editPastor = null;
  if (req.query.editPastorId) {
    editPastor = await findById(req.query.editPastorId);
  }

  let editChurch = null;
  if (req.query.editChurchId) {
    editChurch = await findChurchById(req.query.editChurchId);
  }

  res.render('register', { pastors, churches, editPastor, editChurch });
}

export async function createPastor(req, res) {
  const { nome, telefone, email } = req.body;
  if (!nome) return res.status(400).send('Nome do pastor é obrigatório.');
  try {
    await insertPastor(nome, telefone, email);
    res.redirect('/register/index');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar pastor: ' + error.message);
  }
}

export async function createChurch(req, res) {
  const { nome, cidade } = req.body;
  if (!nome || !cidade) return res.status(400).send('Nome e cidade da igreja são obrigatórios.');
  try {
    await insertChurch(nome, cidade);
    res.redirect('/register/index');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar igreja: ' + error.message);
  }
}

export async function listPastors(req, res) {
  try {
    const data = await getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listChurches(req, res) {
  try {
    const data = await getAllChurches();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePastor(req, res) {
  await deleteById(req.params.id);
  res.redirect('/register/index');
}

export async function deleteChurch(req, res) {
  await deleteChurchById(req.params.id);
  res.redirect('/register/index');
}

export async function updatePastor(req, res) {
  const { nome, telefone, email } = req.body;
  await updateById(req.params.id, nome, telefone, email);
  res.redirect('/register/index');
}

export async function updateChurch(req, res) {
  const { nome, cidade } = req.body;
  await updateChurchById(req.params.id, nome, cidade);
  res.redirect('/register/index');
}
