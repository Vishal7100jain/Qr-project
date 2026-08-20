"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerifiedEnum = exports.BookingType = void 0;
var BookingType;
(function (BookingType) {
    BookingType[BookingType["MEHNDI"] = 1] = "MEHNDI";
    BookingType[BookingType["NAIL"] = 2] = "NAIL";
})(BookingType || (exports.BookingType = BookingType = {}));
var isVerifiedEnum;
(function (isVerifiedEnum) {
    isVerifiedEnum[isVerifiedEnum["VERIFIED"] = 1] = "VERIFIED";
    isVerifiedEnum[isVerifiedEnum["NOT_VERIFIED"] = 0] = "NOT_VERIFIED";
})(isVerifiedEnum || (exports.isVerifiedEnum = isVerifiedEnum = {}));
