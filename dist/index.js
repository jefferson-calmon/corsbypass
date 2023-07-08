"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createServer_1 = require("./createServer");
const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 9090;
(0, createServer_1.createServer)({
    originBlacklist: [],
    originWhitelist: [],
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2'],
    redirectSameOrigin: true,
}).listen(port, host, () => console.log('Running CORS Bypass on ' + host + ':' + port));
