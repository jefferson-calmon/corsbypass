"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
exports.defaultOptions = {
    httpProxyOptions: {
        xfwd: true,
        secure: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
    },
};
