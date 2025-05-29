import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser
} from '../models/configModel.js';

export async function getUsers(req, res) {
  const users = await getAllUsers();
  res.render('init', { title: 'Lista de Usuários', users });
}

export async function createUser(req, res) {
  const { name, email } = req.body;
  await addUser({ name, email });
  res.redirect('/');
}

export async function getUserByIdHandler(req, res) {
  const user = await getUserById(req.params.id);
  res.render('userEdit', { title: 'Editar Usuário', user });
}

export async function updateUserHandler(req, res) {
  const { name, email } = req.body;
  await updateUser(req.params.id, { name, email });
  res.redirect('/');
}

export async function deleteUserHandler(req, res) {
  await deleteUser(req.params.id);
  res.redirect('/');
}
