import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/role.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./expenses.controller";
import { expenseIdValidation, expenseValidation, listExpensesValidation } from "./expenses.validation";

const router = Router();
router.use(authenticate);
router.get("/", listExpensesValidation, validate, controller.list);
router.post("/", authorize("fleet_manager", "admin", "financial_analyst"), expenseValidation, validate, controller.create);
router.delete("/:id", authorize("admin", "financial_analyst"), expenseIdValidation, validate, controller.remove);
export default router;