import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { 
    addToReadLater, 
    getReadLaterList, 
    removeFromReadLater 
} from '../controllers/RLController';

const router = express.Router();

router.post('/', verifyToken, addToReadLater);
router.get('/RL', verifyToken, getReadLaterList);
router.delete('/RL/:id', verifyToken, removeFromReadLater);

export default router;