"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAccessPermissionSchema = exports.CreateAccessPermissionSchema = void 0;
const zod_1 = require("zod");
exports.CreateAccessPermissionSchema = zod_1.z.object({
    moduleName: zod_1.z.string().min(1, "Module name is required"),
    permissions: zod_1.z
        .array(zod_1.z.enum(["view", "create", "edit", "delete"]))
        .nonempty("At least one permission is required"),
});
exports.UpdateAccessPermissionSchema = exports.CreateAccessPermissionSchema.partial();
