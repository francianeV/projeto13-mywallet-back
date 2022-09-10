import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try{
    await mongoClient.connect();
    console.log('mongo ligado')
}catch(err){
    console.log(err.message);
}

const db = mongoClient.db("myWallet");

export default db;

