import { Request, Response } from "express";
import { Types } from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { History } from "../../../models/member/history.model";

// POST - Save a new strategy calculation to history
export const createHistory = async (req: Request, res: Response) => {
  try {
    const { strategyName, legs, result, calculationName } = req.body;
    const userId = req.user?._id;

    // Basic validation
    if (!userId || !strategyName || !legs || !result) {
      return sendError(req, res, "Missing required fields", 400);
    }

    // Validate legs structure (example)
    if (!Array.isArray(legs) || legs.length === 0) {
      return sendError(req, res, "Invalid legs data", 400);
    }

    const newHistory = await History.create({
      userId,
      strategyName,
      legs,
      result,
      calculationName,
    });

    return sendSuccess(
      req,
      res,
      newHistory,
      "Calculation history stored successfully"
    );
  } catch (error) {
    console.error("Error saving history:", error);
    return sendError(req, res, "Internal server error");
  }
};

// GET - Fetch all history records for a user
export const getUserHistory = async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.user._id.toString());
    const { limit = 10, page = 1 } = req.query; // User inputs
    const parsedLimit = Math.min(Number(limit), 100);
    const parsedPage = Math.max(Number(page), 1); // Min page 1

    const history = await History.aggregate([
      // 1. Match user's docs,
      {
        $match: {
          userId,
        },
      },
      // 2. Sort newest first
      { $sort: { calculatedAt: -1 } },
    ]);

    return sendSuccess(req, res, history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return sendError(req, res, "Internal server error");
  }
};

// GET - Fetch a single history record by ID
export const getHistoryById = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    const searchQuery = {
      calculationName: { $regex: name, $options: "i" },
    };

    const record = await History.aggregate([
      {
        $match: searchQuery,
      },
    ]);

    if (record.length === 0) {
      return sendSuccess(req, res, [], "History record not found");
    }

    return sendSuccess(req, res, record);
  } catch (error) {
    console.error("Error fetching history record:", error);
    return sendError(req, res, "Internal server error");
  }
};
