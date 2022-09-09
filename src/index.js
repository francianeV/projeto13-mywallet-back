import express from 'express';
import cors from 'cors';
import joi from 'joi';
import {MongoClient, ObjectId} from 'mongodb';
import dotenv from 'dotenv';
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("myWallet");
});

app.post("/sign-up", async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const passwordHash = bcrypt.hashSync(password, 10);

        await db.collection('users').insertOne({name, email, password: passwordHash});

        res.sendStatus(201);
        
    }catch(error){
        return res.sendStatus(500);
    }

    



})


app.listen(5000, () => console.log('servidor ligado'));