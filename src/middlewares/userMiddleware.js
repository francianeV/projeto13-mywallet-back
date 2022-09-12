import db from  '../database/db.js';

export async function verificaToken(req, res, next){
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "").trim();

    if(!token){
        return res.send(401).send('Token inválido');
    }

    try{

    const session = await db.collection('sessions').findOne({token});

    if(!session){
        return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({_id: session.userId});

    if(!user){
        return res.status(401).send('Usuário inexistente');
    }

    res.locals.user = user;
    next();
    
}catch(err){
    return res.sendStatus(500);
}
    
}