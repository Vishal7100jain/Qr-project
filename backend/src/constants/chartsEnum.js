"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionTypeEnum = exports.actionEnum = exports.chartEnums = void 0;
var chartEnums;
(function (chartEnums) {
    chartEnums["shortStraddle"] = "Short Straddle";
    chartEnums["ironButterfly"] = "Iron Butterfly";
    chartEnums["shortStrangle"] = "Short Strangle";
    chartEnums["shortIronCondor"] = "Short Iron Condor";
    chartEnums["batman"] = "Batman";
    chartEnums["doublePlateau"] = "Double Plateau";
    chartEnums["jadeLizard"] = "Jade Lizard";
    chartEnums["reverseJadeLizard"] = "Reverse Jade Lizard";
})(chartEnums || (exports.chartEnums = chartEnums = {}));
var actionEnum;
(function (actionEnum) {
    actionEnum[actionEnum["buy"] = 1] = "buy";
    actionEnum[actionEnum["sell"] = 2] = "sell";
})(actionEnum || (exports.actionEnum = actionEnum = {}));
var optionTypeEnum;
(function (optionTypeEnum) {
    optionTypeEnum[optionTypeEnum["call"] = 1] = "call";
    optionTypeEnum[optionTypeEnum["put"] = 2] = "put";
})(optionTypeEnum || (exports.optionTypeEnum = optionTypeEnum = {}));
