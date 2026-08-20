import { Router } from "express";
import {
  createHistory,
  getHistoryById,
  getUserHistory,
} from "../../../controllers/v1/member/history.controller";
import {
  createHistorySchema,
  getHistoryByNameSchema,
  getUserHistorySchema,
} from "../../../schemas/member/history.schema";
import { validateData } from "../../../utils/validation.utils";

const CalculationHistoryRoute = Router();

CalculationHistoryRoute.post(
  "/",
  validateData({ body: createHistorySchema }),
  createHistory
);

CalculationHistoryRoute.get(
  "/",
  validateData({ query: getUserHistorySchema }),
  getUserHistory
);

CalculationHistoryRoute.get(
  "/search",
  validateData({ query: getHistoryByNameSchema }),
  getHistoryById
);

export default CalculationHistoryRoute;
