import { z } from "zod";
import { BookingType } from "../../constants/member.enums";
import {
  citySchema,
  email,
  fullName,
  phoneNumber,
  pincodeSchema,
  stateSchema,
} from "./memberAuth.schema";
import { emailOTPSchema } from "./otp.schema";

const location = z
  .string({
    required_error: "Location is required",
    invalid_type_error: "Please enter a valid location",
  })
  .min(15, "Location must be at least 15 characters long")
  .max(100, "Location cannot exceed 100 characters");

const appointmentDate = z
  .string({
    invalid_type_error: "Please select a valid date of appointment",
    required_error: "Event date is required",
  })
  .refine((data) => new Date(data) > new Date(), {
    message: "Event date must be in the future",
  });

const preferredTime = z.string({
  invalid_type_error: "Please enter a valid event time",
  required_error: "Event time is required",
});

const occasionType = z
  .string({
    invalid_type_error: "Please enter a valid Occasion Type",
    required_error: "Occasion Type is required",
  })
  .min(3, "Location must be at least 3 characters long")
  .max(200, "Additional Details must not exceed 200 characters");

const styles = z
  .array(
    z.string({
      required_error: "Style is required",
      invalid_type_error: "Please enter a valid styling you want",
    }),
    {
      required_error: "Styles are required",
      invalid_type_error: "Please enter a valid Styles.",
    }
  )
  .min(1, "At least 1 style must be specified");

const additionalDetails = z
  .string({
    invalid_type_error: "Please enter a valid addition information",
  })
  .max(500, "Additional Details must not exceed 500 characters")
  .optional();

const serviceType = z.nativeEnum(BookingType, {
  invalid_type_error:
    "Please select a valid booking type: Mehndi Artist or Nail Artist.",
  required_error: "Type of service is required",
});

const isAddressVerified = z.boolean({
  required_error: "isAddressVerified field is required",
});

const budgetSchema = z
  .object({
    min: z
      .number({
        required_error: "Minimum budget is required",
        invalid_type_error: "Minimum amount must be a number",
      })
      .positive("Minimum budget must be positive")
      .min(200, "Minimum budget must be at least ₹200")
      .max(50000, "Minimum budget cannot exceed ₹50,000"),

    max: z
      .number({
        required_error: "Maximum budget is required",
        invalid_type_error: "Maximum amount must be a number",
      })
      .positive("Maximum budget must be positive")
      .min(200, "Maximum budget must be at least ₹200")
      .max(50000, "Maximum budget cannot exceed ₹50,000"),
  })
  .refine((data) => data.max >= data.min, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["max"], // This points the error to the max field
  })
  .refine((data) => data.max - data.min >= 500, {
    message: "Budget range should be at least ₹500 difference",
    path: ["max"],
  });

export const CreateBookingSchema = z.object({
  serviceType,
  email,
  location,
  appointmentDate,
  preferredTime,
  occasionType,
  styles,
  additionalDetails,
  budget: budgetSchema,
});

export const CreateBookingMemberNotLogin = z
  .object({
    serviceType,
    fullName,
    email,
    phoneNumber,
    isAddressVerified: isAddressVerified,
    city: citySchema.or(z.literal("").transform(() => undefined)).optional(),
    state: stateSchema.or(z.literal("").transform(() => undefined)).optional(),
    pincode: pincodeSchema,
    location,
    appointmentDate,
    preferredTime,
    occasionType,
    styles,
    additionalDetails,
    budget: budgetSchema,
  })
  .refine(
    (data) =>
      data.fullName &&
      data.email &&
      data.phoneNumber &&
      data.location &&
      data.appointmentDate &&
      data.preferredTime &&
      data.styles &&
      data.serviceType,
    {
      message: "All fields except Additional Details are required.",
      path: ["form"],
    }
  )
  .refine((data) => !data.isAddressVerified || (data.city && data.state), {
    message: "City and State are required when address is verified.",
    path: ["city", "state"],
  });

export const OTPVerificationSchemaForConfirmationBooking = z.object({
  email,
  emailOTP: emailOTPSchema,
  serviceType,
  location,
  appointmentDate,
  preferredTime,
  occasionType,
  styles,
  budget: budgetSchema,
  additionalDetails,
});

export const resendOTPBookingSchema = z.object({
  email,
});

export const UpdatedBookingSchema = z.object({
  serviceType: serviceType.optional(),
  location: location.optional(),
  appointmentDate: appointmentDate.optional(),
  preferredTime: preferredTime.optional(),
  occasionType: occasionType.optional(),
  styles: styles.optional(),
  additionalDetails: additionalDetails.optional(),
  budget: budgetSchema.optional(),
  pincode: pincodeSchema.optional(),
});

export const UpdatedBookingIdSchema = z.object({
  id: z
    .string({ required_error: "Booking Id is required to Update the Booking." })
    .length(24, "Invalid Id length.")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});
