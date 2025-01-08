import http, { Server } from 'http';
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares';
import sequelize from './config/db_config';
const cors = require('cors')({ origin: true });
config();

const app: Application = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000;
const server: Server = http.createServer(app);

// Middlewares
app.use(helmet());
app.disable('x-powered-by');
app.use(cors); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Register routers
app.use('/v1', routes());
// Application Error Handler
app.use(errorHandler);

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

sequelize.sync().then(() => { 
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
