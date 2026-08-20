import { z } from "zod";
import { PermissionType } from "../../constants/permissions.constants";
import {
  pageQuerySchema,
  pageSizeQuerySchema,
  searchQuerySchema,
} from "./common.schema";

export const GetRoleQuerySchema = z.object({
  page: pageQuerySchema,
  pageSize: pageSizeQuerySchema,
  search: searchQuerySchema,
});

const PermissionSchema = z.object({
  module: z
    .string({
      required_error: "Module is required",
      invalid_type_error: "Please enter a valid Module Name",
    })
    .min(1, "Module name cannot be empty")
    .trim(),
  permissions: z.array(z.nativeEnum(PermissionType), {
    required_error: "Permission is required",
    invalid_type_error: "Invalid Permission",
  }),
});

export const CreateRoleSchema = z.object({
  name: z
    .string({ required_error: "Role name is required" })
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must not excced 50 characters"),
  description: z.string().optional(),
  access: z
    .array(PermissionSchema, {
      required_error: "Permission is requried",
      invalid_type_error: "Please enter valid Access",
    })
    .min(1, "At least one permission is required"),
});

export const UpdateRoleSchema = z
  .object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    access: z.array(PermissionSchema).optional(),
  })
  .partial()
  .refine((data) => data.access || data?.description || data?.name, {
    message:
      "At least one of name, description, or access is required to update the role",
    path: ["name", "description", "access"],
  });

export const ParamsMongosId = z.object({
  id: z
    .string({ required_error: "Id is required to Update Role" })
    .length(24, "Invalid Id length")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format"),
});
