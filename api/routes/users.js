import express from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
const router = express.Router();


router.put('/:id', verifyUser, updateUser);

router.get('/:id', verifyUser, getUser);
router.delete('/:id', verifyUser, deleteUser);
router.get('/', verifyAdmin, getUsers);

export default router;