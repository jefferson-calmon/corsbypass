"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProxyResponse = void 0;
const url_1 = __importDefault(require("url"));
const withCors_1 = require("./withCors");
const proxyRequest_1 = require("./proxyRequest");
const parseUrl_1 = require("./parseUrl");
function onProxyResponse(proxy, proxyReq, proxyRes, req, res) {
    const requestState = req.corsbypassRequestState;
    if (!requestState)
        return;
    const statusCode = proxyRes.statusCode;
    if (!requestState?.redirectCount_) {
        res.setHeader('x-request-url', requestState?.location?.href);
    }
    // Handle redirects
    if (statusCode === 301 ||
        statusCode === 302 ||
        statusCode === 303 ||
        statusCode === 307 ||
        statusCode === 308) {
        let locationHeader = proxyRes.headers.location;
        let parsedLocation;
        if (locationHeader) {
            locationHeader = url_1.default.resolve(requestState?.location?.href, locationHeader);
            parsedLocation = (0, parseUrl_1.parseUrl)(locationHeader);
        }
        if (parsedLocation) {
            if (statusCode === 301 || statusCode === 302 || statusCode === 303) {
                // Exclude 307 & 308, because they are rare, and require preserving the method + request body
                requestState.redirectCount_ = requestState?.redirectCount_ + 1 || 1;
                if ((requestState?.redirectCount_ || 1) <=
                    (requestState?.maxRedirects || 1)) {
                    // Handle redirects within the server, because some clients (e.g. Android Stock Browser)
                    // cancel redirects.
                    // Set header for debugging purposes. Do not try to parse it!
                    res.setHeader('X-CORS-Redirect-' + requestState?.redirectCount_, statusCode + ' ' + locationHeader);
                    req.method = 'GET';
                    req.headers['content-length'] = '0';
                    delete req.headers['content-type'];
                    requestState.location = parsedLocation;
                    // Remove all listeners (=reset events to initial state)
                    req.removeAllListeners();
                    // Remove the error listener so that the ECONNRESET "error" that
                    // may occur after aborting a request does not propagate to res.
                    // https://github.com/nodejitsu/node-http-proxy/blob/v1.11.1/lib/http-proxy/passes/web-incoming.js#L134
                    proxyReq.removeAllListeners('error');
                    proxyReq.once('error', function catchAndIgnoreError() { });
                    proxyReq.abort();
                    // Initiate a new proxy request.
                    (0, proxyRequest_1.proxyRequest)(req, res, proxy);
                    return false;
                }
            }
            proxyRes.headers.location =
                requestState?.proxyBaseUrl + '/' + locationHeader;
        }
    }
    // Strip cookies
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['set-cookie2'];
    proxyRes.headers['x-final-url'] = requestState.location.href;
    (0, withCors_1.withCors)(proxyRes.headers, req);
    return true;
}
exports.onProxyResponse = onProxyResponse;
