import db from '../database/db.js';
import joi from 'joi';

const expensesSchema = joi.object({
    value: joi.number().min(1).positive().required(),
    description: joi.string().min(1).required()
});

const cashIn = async (req, res) => {
    const {value, description} = req.body;
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    if(!token){
        return res.sendStatus(401);
    }
    
    const validation =  expensesSchema.validate({value, description}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }

    try{
        const session = await db.collection('sessions').findOne({token});

        if(!session){
            return res.sendStatus(401);
        }

        const cashIn = await db.collection('expenses').insertOne({value, 
                                                   description, 
                                                   user: session._id, 
                                                   type: 'entrada'})
        
        return res.send(cashIn);


    }catch(err){
        return res.sendStatus(500);
    }
}

const cashOut = async(req, res) => {
    const { value, description } = req.body;
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    if(!token){
        return res.sendStatus(401);
    }
    
    const validation =  expensesSchema.validate({value, description}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }

    try{
        const session = await db.collection('sessions').findOne({token});

        if(!session){
            return res.sendStatus(401);
        }

        const cashOut = await db.collection('expenses').insertOne({value, 
                                                   description, 
                                                   user: session._id, 
                                                   type: 'saida'})
        
        return res.send(cashOut);


    }catch(err){
        return res.sendStatus(500);
    }

}

export {cashIn, cashOut};