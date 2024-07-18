import express from 'express';
const router = express.Router();
import weeklyfoodmenu from '../controllers/weeklyFood.js'; 

router.post('/add/:id',weeklyfoodmenu.add);
router.get('/index/:id',weeklyfoodmenu.index);


export default router;