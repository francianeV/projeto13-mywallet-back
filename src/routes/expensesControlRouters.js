import { Router } from 'express';
import { cashIn, cashOut, showUserExpensens } from '../controllers/expensesControlController.js';
import { verificaToken } from '../middlewares/userMiddleware.js';

const expensesRouter = Router();

expensesRouter.post("/cash-in",verificaToken, cashIn);
expensesRouter.post("/cash-out", verificaToken, cashOut);
expensesRouter.get("/list-expenses", verificaToken, showUserExpensens);

export default expensesRouter;