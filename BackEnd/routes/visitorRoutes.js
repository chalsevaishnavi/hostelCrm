import express from 'express';
const router = express.Router();
import visitor from '../controllers/visitor.js'
import auth from '../middlewares/auth.js';

router.post('/add/:id',  visitor.add);
router.get('/index/:id',  visitor.index);

export default router;