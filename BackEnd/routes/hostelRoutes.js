import express from 'express';
import hostel from '../controllers/hostel.js';
const router = express.Router();
import { HostelImage } from '../utils/upload.js';

router.post('/add',HostelImage,hostel.add);
router.get('/list',hostel.index);
router.get('/view/:uniqueCode',hostel.view);
router.put('/edit/:uniqueCode',HostelImage,hostel.edit);
router.delete('/delete/:id',hostel.deleteData);
router.get('/roomcount/:id',hostel.roomsCount);

router.get('/availablebeds/:id',hostel.bedsCount);


export default router;