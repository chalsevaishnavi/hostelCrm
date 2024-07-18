import express from 'express';
const router = express.Router();
import expense from '../controllers/expense.js';

router.post('/add/:id',expense.add);
router.get('/index/:id',expense.index);
router.get('/allexpenses/:id',expense.monthlyExpenses);





export default router;