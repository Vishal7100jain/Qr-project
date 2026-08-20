import { Schema, model } from "mongoose";

const RevokedTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired tokens after 7 days
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RevokedToken = model("RevokedToken", RevokedTokenSchema);
