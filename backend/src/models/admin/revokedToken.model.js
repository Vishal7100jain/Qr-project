"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokedToken = void 0;
const mongoose_1 = require("mongoose");
const RevokedTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});
// Auto-delete expired tokens after 7 days
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.RevokedToken = (0, mongoose_1.model)("RevokedToken", RevokedTokenSchema);
