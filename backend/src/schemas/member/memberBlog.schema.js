"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogFiltereTypeEnum = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../constants/enums");
exports.BlogFiltereTypeEnum = zod_1.z.object({
    type: zod_1.z.coerce.number().pipe(zod_1.z.nativeEnum(enums_1.BlogType, {
        invalid_type_error: "Please select a valid blog type: 1 for featured, 2 for latest, 3 for normal.",
        required_error: "Type of blog is required",
    })),
});
