"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogType = exports.BlogStatus = exports.RoleEnum = exports.PlanTypeEnum = exports.ArtistBookingOrderStatus = exports.AdminBookingOrderStatus = exports.GenderEnum = exports.AuthType = exports.OtpType = exports.OtpStatus = void 0;
// enums/OtpStatus.ts
var OtpStatus;
(function (OtpStatus) {
    OtpStatus[OtpStatus["EXPIRED"] = 0] = "EXPIRED";
    OtpStatus[OtpStatus["ACTIVE"] = 1] = "ACTIVE";
    OtpStatus[OtpStatus["USED"] = 2] = "USED";
    OtpStatus[OtpStatus["CLOSED"] = 3] = "CLOSED";
})(OtpStatus || (exports.OtpStatus = OtpStatus = {}));
var OtpType;
(function (OtpType) {
    OtpType[OtpType["email"] = 1] = "email";
    OtpType[OtpType["number"] = 2] = "number";
})(OtpType || (exports.OtpType = OtpType = {}));
var AuthType;
(function (AuthType) {
    AuthType["GOOGLE"] = "GOOGLE";
    AuthType["INSTAGRAM"] = "INSTAGRAM";
    AuthType["FACEBOOK"] = "FACEBOOK";
    AuthType["CUSTOM"] = "CUSTOM";
})(AuthType || (exports.AuthType = AuthType = {}));
var GenderEnum;
(function (GenderEnum) {
    GenderEnum[GenderEnum["female"] = 1] = "female";
    GenderEnum[GenderEnum["male"] = 2] = "male";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var AdminBookingOrderStatus;
(function (AdminBookingOrderStatus) {
    AdminBookingOrderStatus[AdminBookingOrderStatus["PENDING"] = 1] = "PENDING";
    AdminBookingOrderStatus[AdminBookingOrderStatus["CONFIRMED"] = 2] = "CONFIRMED";
    AdminBookingOrderStatus[AdminBookingOrderStatus["COMPLETED"] = 3] = "COMPLETED";
    AdminBookingOrderStatus[AdminBookingOrderStatus["CANCELLED"] = 4] = "CANCELLED";
})(AdminBookingOrderStatus || (exports.AdminBookingOrderStatus = AdminBookingOrderStatus = {}));
var ArtistBookingOrderStatus;
(function (ArtistBookingOrderStatus) {
    ArtistBookingOrderStatus[ArtistBookingOrderStatus["PENDING"] = 1] = "PENDING";
    ArtistBookingOrderStatus[ArtistBookingOrderStatus["IN_PROGRESS"] = 2] = "IN_PROGRESS";
    ArtistBookingOrderStatus[ArtistBookingOrderStatus["COMPLETED"] = 3] = "COMPLETED";
})(ArtistBookingOrderStatus || (exports.ArtistBookingOrderStatus = ArtistBookingOrderStatus = {}));
var PlanTypeEnum;
(function (PlanTypeEnum) {
    PlanTypeEnum[PlanTypeEnum["MEHNDI"] = 1] = "MEHNDI";
    PlanTypeEnum[PlanTypeEnum["NAIL"] = 2] = "NAIL";
    PlanTypeEnum[PlanTypeEnum["MAKEUP"] = 3] = "MAKEUP";
    PlanTypeEnum[PlanTypeEnum["HAIR"] = 4] = "HAIR";
})(PlanTypeEnum || (exports.PlanTypeEnum = PlanTypeEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum[RoleEnum["ADMIN"] = 1] = "ADMIN";
    RoleEnum[RoleEnum["ARTIST"] = 2] = "ARTIST";
    RoleEnum[RoleEnum["MEMBER"] = 3] = "MEMBER";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var BlogStatus;
(function (BlogStatus) {
    BlogStatus[BlogStatus["DRAFT"] = 0] = "DRAFT";
    BlogStatus[BlogStatus["PUBLISHED"] = 1] = "PUBLISHED";
    BlogStatus[BlogStatus["PENDING"] = 2] = "PENDING";
})(BlogStatus || (exports.BlogStatus = BlogStatus = {}));
var BlogType;
(function (BlogType) {
    BlogType[BlogType["isFeatured"] = 1] = "isFeatured";
    BlogType[BlogType["isLatest"] = 2] = "isLatest";
    BlogType[BlogType["normal"] = 3] = "normal";
})(BlogType || (exports.BlogType = BlogType = {}));
