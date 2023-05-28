import { MongoClient } from 'mongodb';
import logger from '../logger/logger';

export default class MongoDBConnection {

    private url: string;
    private client: MongoClient;

    public constructor(mongoDBConnectionURL: string) {
        this.url = mongoDBConnectionURL;
        this.client = new MongoClient(this.url);
    }

    public connection = async (): Promise<boolean> => {
        await this.client.connect();
        logger.info('Connected successfully to server');
        return true;
    };

    public getClient = (): MongoClient => {
        return this.client;
    };

    // public createDB = async (DBName: string): Promise<Boolean> => {
    //     const db = client.db(dbName);
    //     const collection = db.collection('documents');

    //     // the following code examples can be pasted here...
    // }
}