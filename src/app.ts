import express, { Application } from 'express';
import routes from './routes/auth.routes';
import bodyParser from 'body-parser';

const app: Application = express();

export default () => {
    app.use(bodyParser.urlencoded({'extended':true}));
    app.use(bodyParser.json());
    
    app.use('/user', routes);
    return app;
};