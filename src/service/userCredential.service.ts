import { UserCredentials } from '../schema/usercredentials.schema';
import CredentialsUtil from '../utils/credentials.utils';
import AuthModel from '../models/auth.model';
import LoginAttemptsCountModel from '../models/loginattempts.model';
import { ResponseDTO } from '../dto/ReqRes';
import { DBSearchQueryResponseDTO } from '../dto/DBQueries';

const authDbName = process.env.AUTH_DB_NAME;
const authCollectioName = process.env.AUTH_COLLECTION_NAME;
const loginCountDbName = process.env.LOGIN_COUNT_DB_NAME;
const loginCountCollectioName = process.env.LOGIN_COUNT_COLLECTION_NAME;

const insertNewUserCredentials = async (userData: UserCredentials): Promise<ResponseDTO> => {
    try {
        const {password, ...rest } = userData;
        const encryptedPassword = await CredentialsUtil.generateHashedPassword(password);
        let jwtToken: string;

        const encryptedPasswordCredentials = {
            password: encryptedPassword,
            ...rest,
        };


        if (authDbName && authCollectioName) {
            const authModel = new AuthModel(authDbName, authCollectioName);
            const userRegistered = await authModel.insertNewUser(encryptedPasswordCredentials);
            if (!userRegistered.status) {
                throw new Error(userRegistered.error);
            }
        } else {
            throw new Error('DB_NAME and/or COLLECTION_NAME env var are undefined');
        }

        const resp: ResponseDTO = {
            status: true,
            message: 'User Registered Successfully!',
        };

        return resp;
    } catch (error) {
        console.log(error);

        const resp: ResponseDTO = {
            status: false,
            message: 'User Registration Failed!',
            error: error,
        };

        return resp;
    }
};

const loginUserCredentials = async (username: string, password: string): Promise<any> => {
    try {
        if (authDbName && authCollectioName && loginCountDbName && loginCountCollectioName) {
            const authModel = new AuthModel(authDbName, authCollectioName);
            const loginAttemptsCountModel = new LoginAttemptsCountModel(loginCountDbName, loginCountCollectioName);    
            const loginResp: DBSearchQueryResponseDTO = await authModel.getLoginUserData(username);

            if (loginResp.status && loginResp.data.length > 0) {
                
                const attemptsExceeded = await loginAttemptsCountModel.checkIfAttemptsExceeded(loginResp.data[0]._id.valueOf());
                if (attemptsExceeded) {
                    const resp: ResponseDTO = {
                        status: false,
                        message: 'User Login Failed!',
                        error: 'Wrong Login Attempts has been done more than 3 times. Please contact adminstration for reverting the login access',
                    };
                    
                    return resp;
                } else {
                    const passwordAuthenticate = await CredentialsUtil.comparePasswords(loginResp.data[0].password, password);
                    if (passwordAuthenticate) {
                        const jwtToken: string = CredentialsUtil.generateJWTToken({username, password});

                        await loginAttemptsCountModel.resetAttemptCounts(loginResp.data[0]._id.valueOf());
                        const resp: ResponseDTO = {
                            status: true,
                            message: 'User Login Successfully!',
                            data: {
                                token: jwtToken,
                            },
                        };

                        return resp;
                    } else {
                        const attemptCounts = await loginAttemptsCountModel.reduceUserAttemptCount(loginResp.data[0]._id.valueOf());
                        const resp: ResponseDTO = {
                            status: false,
                            message: 'User Login Failed!',
                            error: `Wrong Credentials! Only ${attemptCounts.data.attemptsLeft} attempts left`,
                        };
                        
                        return resp;
                    }
                }
            } else {
                const resp: ResponseDTO = {
                    status: false,
                    message: 'User Login Failed!',
                    error: 'Wrong Credentials!',
                };
                
                return resp;
            }
        } else {
            throw new Error('DB_NAME and/or COLLECTION_NAME env var are undefined');
        }
    } catch (error) {
        console.log(error);

        const resp: ResponseDTO = {
            status: false,
            message: 'User Login Failed!',
            error: error,
        };

        return resp;
    }
};

export default { insertNewUserCredentials, loginUserCredentials };