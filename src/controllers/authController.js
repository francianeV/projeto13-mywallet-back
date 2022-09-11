import db from '../database/db.js'
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import joi from 'joi';

const singUpSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email({minDomainSegments: 2, tlds:{allow: ['com', 'br']}}).required(),
    password: joi.string().min(1).required()
});

const singInSchema = joi.object({
    password: joi.string().min(1).required(),
    email: joi.string().email({minDomainSegments: 2, tlds:{allow: ['com', 'br']}}).required()
});

const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    const validation = singUpSchema.validate({name, email, password}, {abortEarly: false});

    if(validation.error){
        return res.status(422).send(validation.error.message);
    }

    try {

        const emailIsValid = await db.collection('users').findOne({email});

        if(emailIsValid){
            return res.status(409).send('Email já cadastrado!');
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        await db.collection('users').insertOne({ name, email, password: passwordHash });

        res.sendStatus(201);

    } catch (error) {
        return res.sendStatus(500);

    }
}

const signIn = async (req, res) => {
    const {email, password} = req.body;

    const validation = singInSchema.validate({password, email}, {abortEarly: false});

    if(validation.error){
        return res.status(409).send(validation.error.message);
    }

    try{
        const user = await db.collection('users').findOne({email});
        
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if(user && passwordIsValid) {
            const token = uuid();
            const name = user.name;
            db.collection('sessions').insertOne({
                                                  token,
                                                  userId: user._id,
                                                });
            const body = {token, name}
                                                
            return res.send(body)
            
        }else{
            return res.sendStatus(401);
        }

    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
}

export {signUp, signIn};