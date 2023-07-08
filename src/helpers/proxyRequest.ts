import http from 'http';
import httpProxy from 'http-proxy';
import { Stream } from 'stream';

import { Proxy, Request, Response } from '../types';
import { onProxyResponse } from './onProxyResponse';

export function proxyRequest(req: Request, res: Response, proxy: Proxy) {
  const location = req.corsbypassRequestState?.location;

  req.url = location?.path;

  const proxyOptions: httpProxy.ServerOptions = {
    changeOrigin: false,
    prependPath: false,
    target: location,
    toProxy: false,
    headers: {
      host: location?.host,
    },
    buffer: {
      pipe: (proxyReq: http.ClientRequest) => {
        const proxyReqOn = proxyReq.on;
        proxyReq.on = function (
          eventName: string,
          listener: (...args: any[]) => void
        ) {
          if (eventName !== 'response') {
            return proxyReqOn.call(this, eventName, listener);
          }
          return proxyReqOn.call(
            this,
            'response',
            function (proxyRes: http.ServerResponse) {
              if (onProxyResponse(proxy, proxyReq, proxyRes, req, res)) {
                try {
                  listener(proxyRes);
                } catch (err) {
                  // Wrap in try-catch because an error could occur:
                  // "RangeError: Invalid status code: 0"
                  // https://github.com/Rob--W/cors-anywhere/issues/95
                  // https://github.com/nodejitsu/node-http-proxy/issues/1080

                  // Forward error (will ultimately emit the 'error' event on our proxy object):
                  // https://github.com/nodejitsu/node-http-proxy/blob/v1.11.1/lib/http-proxy/passes/web-incoming.js#L134
                  proxyReq.emit('error', err);
                }
              }
            }
          );
        };
        return req.pipe(proxyReq);
      },
    } as Stream,
  };

  const proxyThroughUrl = req.corsbypassRequestState?.getProxyForUrl(
    location?.href
  );

  if (proxyThroughUrl) {
    proxyOptions.target = proxyThroughUrl;
    proxyOptions.toProxy = true;
    req.url = location?.href;
  }

  try {
    proxy.web(req, res, proxyOptions);
  } catch (err) {
    proxy.emit('error', err, req, res);
  }
}
