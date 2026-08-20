"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
const sender_common_1 = require("../common/sender.common");
const deleteFile_1 = require("../multer/deleteFile");
function validateData(schemas) {
    return (req, res, next) => {
        var _a;
        try {
            if (schemas.body)
                schemas.body.parse(req.body);
            if (schemas.query)
                schemas.query.parse(req.query);
            if (schemas.params)
                schemas.params.parse(req.params);
            next();
        }
        catch (error) {
            (0, deleteFile_1.deleteFile)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    path: issue.path.join("."),
                    message: `${issue.message}`,
                }));
                return (0, sender_common_1.sendError)(req, res, `${errorMessages[0].message}`, 400, errorMessages);
            }
            if (error instanceof Error) {
                return (0, sender_common_1.sendError)(req, res, error.message);
            }
            return (0, sender_common_1.sendError)(req, res, "Unknown validation error");
        }
    };
}
