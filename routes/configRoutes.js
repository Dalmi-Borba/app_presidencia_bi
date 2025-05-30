import express from 'express';
import {
  getUsers,
  createUser,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler
} from '../controllers/configController.js';
import authMidleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMidleware);
router.use((req, res, next) => {
  res.locals.user = req.oidc.user;
  next();
});

router.get('/user', getUsers);
router.post('/add', createUser);
router.get('/edit/:id', getUserByIdHandler);
router.post('/edit/:id', updateUserHandler);
router.get('/delete/:id', deleteUserHandler);

export default router;
