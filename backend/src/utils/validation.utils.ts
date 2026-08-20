import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { sendError } from "../common/sender.common";
import { deleteFile } from "../multer/deleteFile";

// Optional schema keys
interface ValidationSchemas {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export function validateData(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) schemas.body.parse(req.body);
      if (schemas.query) schemas.query.parse(req.query);
      if (schemas.params) schemas.params.parse(req.params);

      next();
    } catch (error) {
      deleteFile(req.file?.path);
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: `${issue.message}`,
        }));

        return sendError(
          req,
          res,
          `${errorMessages[0].message}`,
          400,
          errorMessages
        );
      }

      if (error instanceof Error) {
        return sendError(req, res, error.message);
      }

      return sendError(req, res, "Unknown validation error");
    }
  };
}
