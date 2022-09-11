import { Router } from 'express';
import { cashIn, cashOut } from '../controllers/expensesControlController.js';

const expensesRouter = Router();

expensesRouter.post("/cash-in", cashIn);
expensesRouter.post("/cash-out", cashOut);

export default expensesRouter;