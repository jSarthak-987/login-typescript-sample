import { Db, MongoClient, ObjectId } from 'mongodb';
import { DBSearchQueryResponseDTO } from '../dto/DBQueries';
import DBConnection from '../utils/database.util';

class LoginAttemptsCountModel {
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

    public reduceUserAttemptCount = async (id: string): Promise<DBSearchQueryResponseDTO> => {
        const userAlreadyRegistered = await this.checkIfUserExists(id);
        if (userAlreadyRegistered) {
            const userId = new ObjectId(id);
            const resp = await this.collection.find({_id: userId}).toArray();
            const newCount = resp[0]['count']--;
            await this.collection.findOneAndUpdate({_id: userId}, {$set: {_id: userId, count: newCount - 1}});
            return {
                status: false,
                data: {
                    attemptsLeft: resp[0]['count']--,
                },
            };
        }
        await this.collection.insertOne({_id: new ObjectId(id), count: 3});
        return {
            status: true,
            data: {
                attemptsLeft: 3,
            },
        };
    };

    public resetAttemptCounts = async (id: string) => {
        const userObjectId = new ObjectId(id);
        const userExists = await this.collection.find({ _id: userObjectId }).toArray();

        if (userExists.length > 0) {
            await this.collection.findOneAndUpdate({_id: userObjectId}, {$set: {_id: userObjectId, count: 3}});
        } else {
            return false;
        }
    };

    public checkIfAttemptsExceeded = async (id: string) => {
        const userObjectId = new ObjectId(id);
        const userExists = await this.collection.find({ _id: userObjectId }).toArray();

        if (userExists.length > 0 && userExists[0].count === 1) {
            return true;
        } else {
            return false;
        }
    };

    public checkIfUserExists = async (id: string): Promise<boolean> => {
        const userObjectId = new ObjectId(id);
        const userExists = await this.collection.find({ _id: userObjectId }).toArray();

        if (userExists.length) {
            return true;
        } else {
            return false;
        }
    };
}

export default LoginAttemptsCountModel;