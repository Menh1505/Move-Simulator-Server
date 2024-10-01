import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import Routes from './routes/Routes';
import { SolDir, moveDir } from './config/multerConfig';
import fs from 'fs';
import path from 'path';
require('dotenv').config();

const app = express();
if (!fs.existsSync(SolDir)) {
    fs.mkdirSync(SolDir);
}
if (!fs.existsSync(moveDir)) {
    fs.mkdirSync(moveDir);
}
app.use(Routes);
app.use(errorHandler);
const port = process.env.PORT || 3000;
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});