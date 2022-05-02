import config from './config.js';
import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import line from '@line/bot-sdk';

import indexRouter from './routes/index.js';
import userRouter from './routes/users.js';
import echoRouter from './routes/echo.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: [
        'http://localhost:80',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  

const app = express();

// create LINE SDK config from env variables
const lineAppConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(lineAppConfig);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(line.middleware(lineAppConfig));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/user', userRouter);


app.use('/echo', echoRouter);

app.use(cors(corsOptions));

const port = 80;
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}...`);
});