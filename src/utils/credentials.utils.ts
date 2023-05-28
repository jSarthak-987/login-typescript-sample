import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DBUserCredentialQuery } from '../dto/DBQueries';

const generateHashedPassword = async (password: string): Promise<string> => {
    const salt = process.env.SALT || 'default_salt';
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
};

const generateJWTToken = (userData: DBUserCredentialQuery): string  => {
    const token = jwt.sign({ username: userData.username, password: userData.password }, process.env.JWT_SECRET || '', {
        expiresIn: '1h',
    });

    return token;
};

const decodeJWTToken = (jwtToken: string): any  => {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const token = jwt.verify(jwtToken, secret);
        return token;
    } else {
        return false;
    }
};

const comparePasswords = async (dbEncryptedPassword: string, userPassword: string): Promise<boolean> => {
    const isPasswordValid = await bcrypt.compare(userPassword, dbEncryptedPassword);
    if (!isPasswordValid) {
        return false;
    }

    return true;
};

export default { generateHashedPassword, generateJWTToken, comparePasswords, decodeJWTToken };