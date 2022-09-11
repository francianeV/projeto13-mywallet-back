import { Router } from "express";
import authRouter from "./authRouters.js";
import expensesRouter from "./expensesControlRouters.js";

const router = Router();

router.use(authRouter);
router.use(expensesRouter);

export default router;
