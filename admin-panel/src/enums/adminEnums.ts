export enum AdminStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  SUSPENDED = 2,
}

export enum RoleStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  SUSPENDED = 2,
}

export enum PersonTypeEnum {
  ADMIN = 1,
  ARTIST = 2,
}

export enum BlogStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum RoleEnum {
  ADMIN = 1,
  ARTIST = 2,
  MEMBER = 3,
}

export enum BlogPostStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  PENDING = 2,
}

export enum LogoAddStatus {
  NSE = 1,
  BSE = 2,
  MCX = 3,
  MF = 4,
  NCO = 5,
  BFO = 6,
}

export enum BlogType {
  isFeatured = 1,
  isLatest = 2,
  normal = 3,
}

export enum GenderType {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export type AuthType = "CUSTOM" | "GOOGLE" | "FACEBOOK" | "GITHUB";

// enums/bookingEnums.ts
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

export enum GenderEnum {
  FEMALE = 1,
  MALE = 2,
}

export enum OccasionType {
  BABY_SHOWER = "baby_shower",
  WEDDING = "wedding",
  PARTY = "party",
  EVENT = "event",
  OTHER = "other",
}

export enum DeletedEnum {
  NOT_DELETED = 0,
  DELETED = 1,
}
