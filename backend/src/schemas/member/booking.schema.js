"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedBookingIdSchema = exports.UpdatedBookingSchema = exports.resendOTPBookingSchema = exports.OTPVerificationSchemaForConfirmationBooking = exports.CreateBookingMemberNotLogin = exports.CreateBookingSchema = void 0;
const zod_1 = require("zod");
const member_enums_1 = require("../../constants/member.enums");
const memberAuth_schema_1 = require("./memberAuth.schema");
const otp_schema_1 = require("./otp.schema");
const location = zod_1.z
    .string({
    required_error: "Location is required",
    invalid_type_error: "Please enter a valid location",
})
    .min(15, "Location must be at least 15 characters long")
    .max(100, "Location cannot exceed 100 characters");
const appointmentDate = zod_1.z
    .string({
    invalid_type_error: "Please select a valid date of appointment",
    required_error: "Event date is required",
})
    .refine((data) => new Date(data) > new Date(), {
    message: "Event date must be in the future",
});
const preferredTime = zod_1.z.string({
    invalid_type_error: "Please enter a valid event time",
    required_error: "Event time is required",
});
const occasionType = zod_1.z
    .string({
    invalid_type_error: "Please enter a valid Occasion Type",
    required_error: "Occasion Type is required",
})
    .min(3, "Location must be at least 3 characters long")
    .max(200, "Additional Details must not exceed 200 characters");
const styles = zod_1.z
    .array(zod_1.z.string({
    required_error: "Style is required",
    invalid_type_error: "Please enter a valid styling you want",
}), {
    required_error: "Styles are required",
    invalid_type_error: "Please enter a valid Styles.",
})
    .min(1, "At least 1 style must be specified");
const additionalDetails = zod_1.z
    .string({
    invalid_type_error: "Please enter a valid addition information",
})
    .max(500, "Additional Details must not exceed 500 characters")
    .optional();
const serviceType = zod_1.z.nativeEnum(member_enums_1.BookingType, {
    invalid_type_error: "Please select a valid booking type: Mehndi Artist or Nail Artist.",
    required_error: "Type of service is required",
});
const isAddressVerified = zod_1.z.boolean({
    required_error: "isAddressVerified field is required",
});
const budgetSchema = zod_1.z
    .object({
    min: zod_1.z
        .number({
        required_error: "Minimum budget is required",
        invalid_type_error: "Minimum amount must be a number",
    })
        .positive("Minimum budget must be positive")
        .min(200, "Minimum budget must be at least ₹200")
        .max(50000, "Minimum budget cannot exceed ₹50,000"),
    max: zod_1.z
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
exports.CreateBookingSchema = zod_1.z.object({
    serviceType,
    email: memberAuth_schema_1.email,
    location,
    appointmentDate,
    preferredTime,
    occasionType,
    styles,
    additionalDetails,
    budget: budgetSchema,
});
exports.CreateBookingMemberNotLogin = zod_1.z
    .object({
    serviceType,
    fullName: memberAuth_schema_1.fullName,
    email: memberAuth_schema_1.email,
    phoneNumber: memberAuth_schema_1.phoneNumber,
    isAddressVerified: isAddressVerified,
    city: memberAuth_schema_1.citySchema.or(zod_1.z.literal("").transform(() => undefined)).optional(),
    state: memberAuth_schema_1.stateSchema.or(zod_1.z.literal("").transform(() => undefined)).optional(),
    pincode: memberAuth_schema_1.pincodeSchema,
    location,
    appointmentDate,
    preferredTime,
    occasionType,
    styles,
    additionalDetails,
    budget: budgetSchema,
})
    .refine((data) => data.fullName &&
    data.email &&
    data.phoneNumber &&
    data.location &&
    data.appointmentDate &&
    data.preferredTime &&
    data.styles &&
    data.serviceType, {
    message: "All fields except Additional Details are required.",
    path: ["form"],
})
    .refine((data) => !data.isAddressVerified || (data.city && data.state), {
    message: "City and State are required when address is verified.",
    path: ["city", "state"],
});
exports.OTPVerificationSchemaForConfirmationBooking = zod_1.z.object({
    email: memberAuth_schema_1.email,
    emailOTP: otp_schema_1.emailOTPSchema,
    serviceType,
    location,
    appointmentDate,
    preferredTime,
    occasionType,
    styles,
    budget: budgetSchema,
    additionalDetails,
});
exports.resendOTPBookingSchema = zod_1.z.object({
    email: memberAuth_schema_1.email,
});
exports.UpdatedBookingSchema = zod_1.z.object({
    serviceType: serviceType.optional(),
    location: location.optional(),
    appointmentDate: appointmentDate.optional(),
    preferredTime: preferredTime.optional(),
    occasionType: occasionType.optional(),
    styles: styles.optional(),
    additionalDetails: additionalDetails.optional(),
    budget: budgetSchema.optional(),
    pincode: memberAuth_schema_1.pincodeSchema.optional(),
});
exports.UpdatedBookingIdSchema = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "Booking Id is required to Update the Booking." })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});
