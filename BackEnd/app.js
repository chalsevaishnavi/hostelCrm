import express from "express";
import cors from "cors";
import serverRoutes from './routes/serverRoutes.js'
import connect from "./db/connectiondb.js";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use('/',serverRoutes);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/HostelImages', express.static(path.join(__dirname, 'uploads/HostelImages')));
app.use('/uploads/Profiles',express.static(path.join(__dirname, 'uploads/Profiles')));
app.use('/uploads/RoomImages',express.static(path.join(__dirname, 'uploads/RoomImages')));

const port = process.env.PORT || "3001";
app.listen(port, () => {
  console.log(`Server listining at http://localhost:${port}`);
});

