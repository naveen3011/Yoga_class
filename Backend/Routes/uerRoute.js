import express from 'express';
import { onCreateUser, onGetUserById } from '../Controllers/user.js';

const router = express.Router();

router.post('/', onCreateUser);
router.get('/:id', onGetUserById);

export default router;
