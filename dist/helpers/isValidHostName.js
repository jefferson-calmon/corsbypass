"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidHostName = void 0;
const net_1 = __importDefault(require("net"));
const regex_top_level_domain_1 = require("../constants/regex-top-level-domain");
function isValidHostName(hostname) {
    return !!(regex_top_level_domain_1.regexp_tld.test(hostname) ||
        net_1.default.isIPv4(hostname) ||
        net_1.default.isIPv6(hostname));
}
exports.isValidHostName = isValidHostName;
