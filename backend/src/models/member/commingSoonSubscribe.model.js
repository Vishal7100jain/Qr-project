"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommingSoonSubsSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});
const CommingSoonSubs = (0, mongoose_1.model)("CommingSoonSubs", CommingSoonSubsSchema);
exports.default = CommingSoonSubs;
