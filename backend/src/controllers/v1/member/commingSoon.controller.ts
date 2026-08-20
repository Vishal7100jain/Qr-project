import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { emailService } from "../../../config/smtp.config";
import CommingSoonSubs from "../../../models/member/commingSoonSubscribe.model";

// Subscribe User For comming soon
export const subscribeMember = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes("@")) {
      return sendError(req, res, "Please provide a valid email address", 400);
    }

    // Check if already subscribed
    const existingSubscriber = await CommingSoonSubs.findOne({ email });
    if (existingSubscriber) {
      return sendSuccess(req, res, {}, "You're already subscribed!");
    }

    const newSubscriber = new CommingSoonSubs({ email });
    await newSubscriber.save();
    await emailService.sendSubcribeEmail(email);

    return sendSuccess(
      req,
      res,
      {},
      "Thank you for subscribing! We'll notify you when we launch."
    );
  } catch (error: any) {
    console.error("Subscription error:", error);
    return sendError(
      req,
      res,
      error?.message || "Failed to subscribe. Please try again later.",
      500
    );
  }
};
