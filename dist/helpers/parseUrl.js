"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = void 0;
const url_1 = __importDefault(require("url"));
function parseUrl(req_url) {
    const match = req_url.match(/^(?:(https?:)?\/\/)?(([^\/?]+?)(?::(\d{0,5})(?=[\/?]|$))?)([\/?][\S\s]*|$)/i);
    //                              ^^^^^^^          ^^^^^^^^      ^^^^^^^                ^^^^^^^^^^^^
    //                            1:protocol       3:hostname     4:port                 5:path + query string
    //                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //                                            2:host
    if (!match) {
        return null;
    }
    if (!match[1]) {
        if (/^https?:/i.test(req_url)) {
            // The pattern at top could mistakenly parse "http:///" as host="http:" and path=///.
            return null;
        }
        // Scheme is omitted.
        if (req_url.lastIndexOf('//', 0) === -1) {
            // "//" is omitted.
            req_url = '//' + req_url;
        }
        req_url = (match[4] === '443' ? 'https:' : 'http:') + req_url;
    }
    const parsed = url_1.default.parse(req_url);
    if (!parsed.hostname) {
        // "http://:1/" and "http:/notenoughslashes" could end up here.
        return null;
    }
    return parsed;
}
exports.parseUrl = parseUrl;
