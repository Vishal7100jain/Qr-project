import { z } from "zod";
import { StatusEnum } from "../../constants/admin.enums";
import { BlogStatus } from "../../constants/enums";
export const pageQuerySchema = z.coerce.number().int().min(1).default(1);
export const pageSizeQuerySchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(10);
export const searchQuerySchema = z.coerce.string().trim().default("");
export const statusQuerySchema = z
  .union([
    // Try StatusEnum first
    z.nativeEnum(StatusEnum, {
      invalid_type_error:
        "Please enter a valid Status: Active (1), Inactive (0).",
    }),
    // If StatusEnum fails, try BlogStatus
    z.nativeEnum(BlogStatus, {
      invalid_type_error:
        "Please enter a valid Status: Draft (0), Published (1), Pending (2).",
    }),
    // If both enums fail, try string transformation for numeric strings
    z
      .string()
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) return val; // Return original if not a number

        // Try to match with StatusEnum
        if (Object.values(StatusEnum).includes(parsed as StatusEnum)) {
          return parsed as StatusEnum;
        }

        // Try to match with BlogStatus
        if (Object.values(BlogStatus).includes(parsed as BlogStatus)) {
          return parsed as BlogStatus;
        }

        return val; // Return original if no match (will fail validation)
      })
      .pipe(z.union([z.nativeEnum(StatusEnum), z.nativeEnum(BlogStatus)])),
  ])
  .optional()
  .nullable();

export const mongooseIdValidationSchema = z
  .string({ required_error: "Role Id is required to Create a new Admin." })
  .length(24, "Invalid Id length.")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format.");

export const IdSchemaUpdate = z.object({
  id: z
    .string({ required_error: "Id is required to perform update action." })
    .length(24, "Invalid Id length.")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});

export const IdSchemaDelete = z.object({
  id: z
    .string({ required_error: "Id is required to perform delete action." })
    .length(24, "Invalid Id length.")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});

export const IdSchemaGet = z.object({
  id: z
    .string({ required_error: "Id is required to perform get action." })
    .length(24, "Invalid Id length.")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});

export const PageListQuerySchema = z.object({
  page: pageQuerySchema,
  pageSize: pageSizeQuerySchema,
  search: searchQuerySchema,
  status: statusQuerySchema,
});
