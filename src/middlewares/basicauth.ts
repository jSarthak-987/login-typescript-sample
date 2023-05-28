import { Request, Response, NextFunction } from 'express';

const basicAuthOnNewUserSignUp = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send('Unauthorized');
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');


    if (username && password) {
        res.locals.userName = username;
        res.locals.password = password;
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

export default basicAuthOnNewUserSignUp;