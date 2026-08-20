// src/services/email.service.ts
import nodemailer, { Transporter } from "nodemailer";
import { BookingConfirmationHTML } from "../email/bookingConfirmation-html";
import { SubscribeHTML } from "../email/subscribe-html";

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
  bcc?: string[];
}

class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;
  private config = {
    // host: envConfig.EMAIL_CONFIG.server,
    // port: envConfig.EMAIL_CONFIG.port,
    secure: true,
    auth: {
      // user: envConfig.EMAIL_CONFIG.user,
      // pass: envConfig.EMAIL_CONFIG.password,
    },
    tls: {
      ciphers: "SSLv3",
    },
  };

  private constructor() {
    this.transporter = nodemailer.createTransport(this.config);
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log("SMTP connection verified");
    } catch (error) {
      console.error("Error verifying SMTP connection:", error);
      throw error;
    }
  }

  public async sendOTP(email: string, otp: number): Promise<void> {
    const mailOptions: EmailOptions = {
      from: `${"envConfig.EMAIL_CONFIG.user"}`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    };

    return this.sendMail(mailOptions);
  }

  public async sendSubcribeEmail(email: string): Promise<void> {
    const mailOptions: EmailOptions = {
      from: `${"envConfig.EMAIL_CONFIG.user"}`,
      to: email,
      subject: "Thanks for subscribing ✨💚",
      html: SubscribeHTML(),
    };

    return this.sendMail(mailOptions);
  }

  public async sendBookingConfirmation(
    data: {
      type?: "confirmed" | "updated";
      fullName: string;
      serviceType: string;
      appointmentDate: Date;
      preferredTime: string;
      location: string;
      styles: string[];
      email: string;
      budget: {
        min: number;
        max: number;
      };
      occasionType: string;
    },
    subject: string
  ): Promise<void> {
    const mailOptions: EmailOptions = {
      from: `${"envConfig.EMAIL_CONFIG.user"}`,
      to: data?.email,
      subject,
      html: BookingConfirmationHTML({ ...data }),
    };

    return this.sendMail(mailOptions);
  }

  private async sendMail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `${"envConfig.EMAIL_CONFIG.user"}`,
        ...options,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
  }
}

// Initialize at server startup
export const emailService = EmailService.getInstance();
