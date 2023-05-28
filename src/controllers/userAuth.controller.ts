import { Request, Response } from 'express';
import { ResponseDTO } from '../dto/ReqRes';
import logger from '../logger/logger';
import { UserCredentials } from '../schema/usercredentials.schema';
import UserCredentialService from '../service/userCredential.service';
import Joi from 'joi';


const signUpNewUser = async (req: Request, res: Response) => {
    const credentialData: UserCredentials = req.body as any as UserCredentials;
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().min(10).required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        hobbies: Joi.array().required(),
    });

    const { error, value } = schema.validate(credentialData);

    if (error) {
        logger.error(`Error: ${error}`);

        const resp: ResponseDTO = {
            status: false,
            error: error.message,
            message: 'req.body invalid',
        };
        return res.status(400).send(resp);
    }

    const credentialsInserted: ResponseDTO = await UserCredentialService.insertNewUserCredentials(value);

    if (credentialsInserted.status) {
        res.status(200);
    } else {
        logger.error(`Error: ${JSON.stringify(credentialsInserted)}`);
        res.status(400);
    }

    return res.send(credentialsInserted);
};

const loginUser = async (req: Request, res: Response) => {
    
    const userName = res.locals.userName;
    const password = res.locals.password;

    if (userName && password) {
        const resp: ResponseDTO = await UserCredentialService.loginUserCredentials(userName, password);

        if (resp.status) {
            res.status(200);
        } else {
            logger.error(`Error: ${JSON.stringify(resp)}`);
            res.status(400);
        }

        return res.send(resp);
    } else {
        logger.error(`Error: loginUser -> No Username or password is provided`);

        const resp: ResponseDTO = {
            status: false,
            error: 'No Username or password is provided',
        };
        return res.status(400).send(resp);
    }
};

export default { signUpNewUser, loginUser };