import { Db, MongoClient } from 'mongodb';
import { DBSearchQueryResponseDTO, DBInsertResponseDTO, DBUserCredentialQuery } from '../dto/DBQueries';
import { UserCredentials } from '../schema/usercredentials.schema';
import DBConnection from '../utils/database.util';

class AuthModel {
    private dbName: string;
    private collectionName: string;
    private collection: any;

    public constructor(dbName: string, collectionName: string) {
        this.dbName = dbName;
        this.collectionName = collectionName;

        this.createSignUpUserModel();
    }

    private createSignUpUserModel = async () => {
        const client: MongoClient = DBConnection.getClient();
        if (this.dbName && this.collectionName) {
            const db: Db = client.db(this.dbName);
            this.collection = db.collection(this.collectionName);
        }
    };

    public insertNewUser = async (userData: UserCredentials): Promise<DBInsertResponseDTO> => {
        const userAlreadyRegistered = await this.checkIfUserExists(userData.email, userData.phone);
        if (userAlreadyRegistered) {
            return {
                status: false,
                error: userAlreadyRegistered,
            };
        }
        await this.collection.insertOne(userData);
        return {
            status: true,
        };
    };

    public getLoginUserData = async (userName: string): Promise<DBSearchQueryResponseDTO> => {
        const searchResult: UserCredentials = await this.collection.find({
            $or: [{
                email: userName,
            }, {
                phone: Number(userName),
            }],
        }).toArray();

        const resp: DBSearchQueryResponseDTO = {
            status: true,
            data: searchResult,
        };
        return resp;
    };

    public checkIfUserExists = async (email: string, phone: number) => {
        const emailAlreadyRegistered = await this.collection.find({ email: email }).toArray();
        const phoneAlreadyRegistered = await this.collection.find({ phone: phone }).toArray();

        if (emailAlreadyRegistered.length) {
            return 'Email Already Registered';
        }
        
        if (phoneAlreadyRegistered.length) {
            return 'Phone number already Registered';
        } else {
            return false;
        }
    };
}

export default AuthModel;