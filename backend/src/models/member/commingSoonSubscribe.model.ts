import { Document, model, Schema } from "mongoose";

export interface ICommingSoonSubs extends Document {
  email: string;
}

const CommingSoonSubsSchema = new Schema<ICommingSoonSubs>(
  {
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const CommingSoonSubs = model<ICommingSoonSubs>(
  "CommingSoonSubs",
  CommingSoonSubsSchema
);
export default CommingSoonSubs;
