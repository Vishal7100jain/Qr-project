import { z } from "zod";

export const CreateAccessPermissionSchema = z.object({
  moduleName: z.string().min(1, "Module name is required"),
  permissions: z
    .array(z.enum(["view", "create", "edit", "delete"]))
    .nonempty("At least one permission is required"),
});

export const UpdateAccessPermissionSchema =
  CreateAccessPermissionSchema.partial();
