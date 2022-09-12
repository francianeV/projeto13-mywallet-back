import db from '../database/db.js';
import joi from 'joi';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

const expensesSchema = joi.object({
    value: joi.number().min(1).positive().required(),
    description: joi.string().min(1).required()
});

const cashIn = async (req, res) => {
    const {value, description} = req.body;
    const {user} = res.locals;
    

    try{
        const cashIn = await db.collection('expenses').insertOne({value, 
                                                   description, 
                                                   user: user._id,
                                                   time: dayjs().format('DD/MM'), 
                                                   type: 'entrada'})
        
        return res.send(cashIn);


    }catch(err){
        return res.sendStatus(500);
    }
}

const cashOut = async(req, res) => {
    const { value, description } = req.body;
    const {user} = res.locals;
    
    const validation =  expensesSchema.validate({value, description}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }

    try{
        const cashOut = await db.collection('expenses').insertOne({value, 
                                                   description, 
                                                   user: user._id,
                                                   time: dayjs().format('DD/MM'), 
                                                   type: 'saida'})
        
        return res.send(cashOut);


    }catch(err){
        return res.sendStatus(500);
    }

}

const showUserExpensens = async (req, res) => {
    const {user} = res.locals;

    try{
        const list = await db.collection('expenses').find({user: new ObjectId(user._id)}).toArray();

        delete list.type, list._id, list.user;
        return res.send(list);

    }catch(err){
        return res.sendStatus(500);
    }
}

export {cashIn, cashOut, showUserExpensens};