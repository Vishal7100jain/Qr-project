import express from "express";
import { subscribeMember } from "../../../controllers/v1/member/commingSoon.controller";
import { MemberSubscriberSchema } from "../../../schemas/member/subscriber.schema";
import { validateData } from "../../../utils/validation.utils";

const MemberComingSoonRouter = express.Router();

// OTP Verfity for sign up
MemberComingSoonRouter.post(
  "/",
  validateData({ body: MemberSubscriberSchema }),
  subscribeMember
);

export default MemberComingSoonRouter;
