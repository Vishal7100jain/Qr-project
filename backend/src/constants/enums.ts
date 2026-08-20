// enums/OtpStatus.ts
export enum OtpStatus {
  EXPIRED = 0, // Timed out
  ACTIVE = 1, // Can still be used
  USED = 2, // Successfully verified
  CLOSED = 3, // Invalidated (e.g., due to resend)
}

export enum OtpType {
  email = 1,
  number = 2,
}

export enum AuthType {
  GOOGLE = "GOOGLE",
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  CUSTOM = "CUSTOM",
}

export enum GenderEnum {
  female = 1,
  male = 2,
}

export enum AdminBookingOrderStatus {
  PENDING = 1, // No artist assigned
  CONFIRMED = 2, // Artist assigned and Artist confirmed pricing/details
  COMPLETED = 3, // Order completed
  CANCELLED = 4, // Order was cancelled
}

export enum ArtistBookingOrderStatus {
  PENDING = 1, // Artist hasn't started the order
  IN_PROGRESS = 2, // Artist is working on the order
  COMPLETED = 3, // Artist has completed the order
}

export enum PlanTypeEnum {
  MEHNDI = 1,
  NAIL = 2,
  MAKEUP = 3,
  HAIR = 4,
}

export enum RoleEnum {
  ADMIN = 1,
  ARTIST = 2,
  MEMBER = 3,
}

export enum BlogStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  PENDING = 2,
}

export enum BlogType {
  isFeatured = 1,
  isLatest = 2,
  normal = 3,
}
