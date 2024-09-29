import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import Routes from './routes/Routes';
import fs from 'fs';
import path from 'path';
require('dotenv').config();

// Create an instance of the Express application
const app = express();

// Create uploads directory if not exists
const uploadDir = '../uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Use routes
app.use(Routes);

// Middleware handle error
app.use(errorHandler);

// Server listening on port 8989. If 8989 could not found, use 3000
const port = process.env.PORT || 3000;
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});
