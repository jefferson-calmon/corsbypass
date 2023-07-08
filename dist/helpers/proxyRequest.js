"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyRequest = void 0;
const onProxyResponse_1 = require("./onProxyResponse");
function proxyRequest(req, res, proxy) {
    const location = req.corsbypassRequestState?.location;
    req.url = location?.path;
    const proxyOptions = {
        changeOrigin: false,
        prependPath: false,
        target: location,
        toProxy: false,
        headers: {
            host: location?.host,
        },
        buffer: {
            pipe: (proxyReq) => {
                const proxyReqOn = proxyReq.on;
                proxyReq.on = function (eventName, listener) {
                    if (eventName !== 'response') {
                        return proxyReqOn.call(this, eventName, listener);
                    }
                    return proxyReqOn.call(this, 'response', function (proxyRes) {
                        if ((0, onProxyResponse_1.onProxyResponse)(proxy, proxyReq, proxyRes, req, res)) {
                            try {
                                listener(proxyRes);
                            }
                            catch (err) {
                                // Wrap in try-catch because an error could occur:
                                // "RangeError: Invalid status code: 0"
                                // https://github.com/Rob--W/cors-anywhere/issues/95
                                // https://github.com/nodejitsu/node-http-proxy/issues/1080
                                // Forward error (will ultimately emit the 'error' event on our proxy object):
                                // https://github.com/nodejitsu/node-http-proxy/blob/v1.11.1/lib/http-proxy/passes/web-incoming.js#L134
                                proxyReq.emit('error', err);
                            }
                        }
                    });
                };
                return req.pipe(proxyReq);
            },
        },
    };
    const proxyThroughUrl = req.corsbypassRequestState?.getProxyForUrl(location?.href);
    if (proxyThroughUrl) {
        proxyOptions.target = proxyThroughUrl;
        proxyOptions.toProxy = true;
        req.url = location?.href;
    }
    try {
        proxy.web(req, res, proxyOptions);
    }
    catch (err) {
        proxy.emit('error', err, req, res);
    }
}
exports.proxyRequest = proxyRequest;
