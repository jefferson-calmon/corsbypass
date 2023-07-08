"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProxyError = void 0;
function onProxyError(err, req, res) {
    if (res.headersSent) {
        if (res.writableEnded === false) {
            res.end();
        }
        return;
    }
    const headerNames = res.getHeaderNames
        ? res.getHeaderNames()
        : Object.keys(res._headers || {});
    headerNames.forEach(function (name) {
        res.removeHeader(name);
    });
    res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
    res.end('Not found because of proxy error: ' + err);
}
exports.onProxyError = onProxyError;
