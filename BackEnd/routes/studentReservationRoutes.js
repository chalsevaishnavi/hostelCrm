import express from "express";
import studentrev from '../controllers/reservationstudent.js';
import auth from "../middlewares/auth.js";

const router = express.Router();



router.post('/add/:id', studentrev.add);
router.get('/index/:id',studentrev.index);
router.get('/view/:id', studentrev.view);
router.put('/edit/:id',studentrev.edit);
router.delete('/deleteData/:id', studentrev.deleteData);






export default router;