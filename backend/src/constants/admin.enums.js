"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonTypeEnum = exports.DeletedEnum = exports.StatusEnum = exports.VerifiedEnum = exports.AdminStatus = void 0;
var AdminStatus;
(function (AdminStatus) {
    AdminStatus[AdminStatus["ACTIVE"] = 1] = "ACTIVE";
    AdminStatus[AdminStatus["INACTIVE"] = 0] = "INACTIVE";
    AdminStatus[AdminStatus["SUSPENDED"] = 2] = "SUSPENDED";
})(AdminStatus || (exports.AdminStatus = AdminStatus = {}));
var VerifiedEnum;
(function (VerifiedEnum) {
    VerifiedEnum[VerifiedEnum["VERIFIED"] = 1] = "VERIFIED";
    VerifiedEnum[VerifiedEnum["NOT_VERIFIED"] = 0] = "NOT_VERIFIED";
})(VerifiedEnum || (exports.VerifiedEnum = VerifiedEnum = {}));
var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["ACTIVE"] = 1] = "ACTIVE";
    StatusEnum[StatusEnum["INACTIVE"] = 0] = "INACTIVE";
})(StatusEnum || (exports.StatusEnum = StatusEnum = {}));
var DeletedEnum;
(function (DeletedEnum) {
    DeletedEnum[DeletedEnum["NOT_DELETED"] = 0] = "NOT_DELETED";
    DeletedEnum[DeletedEnum["DELETED"] = 1] = "DELETED";
})(DeletedEnum || (exports.DeletedEnum = DeletedEnum = {}));
var PersonTypeEnum;
(function (PersonTypeEnum) {
    PersonTypeEnum[PersonTypeEnum["ADMIN"] = 1] = "ADMIN";
    PersonTypeEnum[PersonTypeEnum["ARTIST"] = 2] = "ARTIST";
})(PersonTypeEnum || (exports.PersonTypeEnum = PersonTypeEnum = {}));
