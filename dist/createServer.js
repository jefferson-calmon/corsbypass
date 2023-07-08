"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const http_proxy_1 = __importDefault(require("http-proxy"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const getHandler_1 = require("./helpers/getHandler");
const defaults_1 = require("./constants/defaults");
const onProxyError_1 = require("./helpers/onProxyError");
function createServer(options) {
    options = Object.assign(defaults_1.defaultOptions, options);
    const proxy = http_proxy_1.default.createServer(options.httpProxyOptions);
    const requestHandler = (0, getHandler_1.getHandler)(options, proxy);
    const server = options.httpsOptions
        ? https_1.default.createServer(options.httpsOptions, requestHandler)
        : http_1.default.createServer(requestHandler);
    proxy.on('error', (err, req, res) => (0, onProxyError_1.onProxyError)(err, req, res));
    return server;
}
exports.createServer = createServer;
