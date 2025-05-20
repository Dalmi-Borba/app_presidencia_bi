const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/add', userController.createUser);
router.get('/edit/:id', userController.getUserById);
router.post('/edit/:id', userController.updateUser);
router.get('/delete/:id', userController.deleteUser);

module.exports = router;
