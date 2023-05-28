import 'dotenv/config';
import { Application } from 'express';
import { MongoClient } from 'mongodb';
import App from './app';
import logger from './logger/logger';
import DBConnectionUtil from './utils/database.util';

const port: number = Number(process.env.PORT) || 3000;
const MongoDBConnectionURL:string = process.env.MONGODB_URL || '';

DBConnectionUtil.dbConnection(MongoDBConnectionURL)
    .then((resp: MongoClient) => {
        return resp;
    })
    .catch((error) => {
        logger.error(error);
    });

const express: Application = App();

express.listen(port, () => {
    logger.info(`App is running on port ${port} in ${express.get('env')} mode`);
});