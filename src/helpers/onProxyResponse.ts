import http from 'http';
import url from 'url';

import { Proxy, Request, Response } from '../types';
import { withCors } from './withCors';
import { proxyRequest } from './proxyRequest';
import { parseUrl } from './parseUrl';

export function onProxyResponse(
  proxy: Proxy,
  proxyReq: http.ClientRequest,
  proxyRes: http.ServerResponse,
  req: Request,
  res: Response
) {
  const requestState = req.corsbypassRequestState;

  if (!requestState) return;

  const statusCode = proxyRes.statusCode;

  if (!requestState?.redirectCount_) {
    res.setHeader('x-request-url', requestState?.location?.href);
  }
  if (
    statusCode === 301 ||
    statusCode === 302 ||
    statusCode === 303 ||
    statusCode === 307 ||
    statusCode === 308
  ) {
    let locationHeader = (proxyRes as any).headers.location as string;
    let parsedLocation;
    if (locationHeader) {
      locationHeader = url.resolve(
        requestState?.location?.href,
        locationHeader
      );
      parsedLocation = parseUrl(locationHeader);
    }
    if (parsedLocation) {
      if (statusCode === 301 || statusCode === 302 || statusCode === 303) {
        requestState.redirectCount_ = requestState?.redirectCount_ + 1 || 1;

        if (
          (requestState?.redirectCount_ || 1) <=
          (requestState?.maxRedirects || 1)
        ) {
          res.setHeader(
            'X-CORS-Redirect-' + requestState?.redirectCount_,
            statusCode + ' ' + locationHeader
          );

          req.method = 'GET';
          req.headers['content-length'] = '0';
          delete req.headers['content-type'];
          requestState.location = parsedLocation;

          req.removeAllListeners();

          proxyReq.removeAllListeners('error');
          proxyReq.once('error', function catchAndIgnoreError() {});
          proxyReq.abort();

          // Initiate a new proxy request.
          proxyRequest(req, res, proxy);
          return false;
        }
      }
      (proxyRes as any).headers.location =
        requestState?.proxyBaseUrl + '/' + locationHeader;
    }
  }

  // Strip cookies
  delete (proxyRes as any).headers['set-cookie'];
  delete (proxyRes as any).headers['set-cookie2'];

  (proxyRes as any).headers['x-final-url'] = requestState.location.href;
  
  withCors((proxyRes as any).headers, req);

  return true;
}
