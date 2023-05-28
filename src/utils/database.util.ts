import MongoDBConnection from '../connection/mongo.connection';
import { MongoClient } from 'mongodb';

let mongoClient: MongoClient;

const dbConnection = async (MongoDBConnectionURL: string): Promise<MongoClient> => {
    if (mongoClient) {
        return mongoClient;
    }
    
    const mongoDBConnection: MongoDBConnection = new MongoDBConnection(MongoDBConnectionURL);
    const connected = await mongoDBConnection.connection();
    
    if (connected) {
        mongoClient = mongoDBConnection.getClient();
    }
    
    return mongoClient;
};

const getClient = (): MongoClient => {
    return mongoClient;
};

export default { dbConnection, getClient };