const UserModel = require('../models/userModel');

exports.getUsers = async (req, res) => {
  const users = await UserModel.getAllUsers();
  res.render('init', { title: 'Lista de Usuários', users });
};

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  await UserModel.addUser({ name, email });
  res.redirect('/');
};

exports.getUserById = async (req, res) => {
  const user = await UserModel.getUserById(req.params.id);
  res.render('userEdit', { title: 'Editar Usuário', user });
};

exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  await UserModel.updateUser(req.params.id, { name, email });
  res.redirect('/');
};

exports.deleteUser = async (req, res) => {
  await UserModel.deleteUser(req.params.id);
  res.redirect('/');
};
