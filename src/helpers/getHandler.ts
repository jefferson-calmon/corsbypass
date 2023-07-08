import { getProxyForUrl } from 'proxy-from-env';

import { Proxy, Request, Response, CreateServerOptions } from '../types';

import { renderDocs } from '../helpers/renderDocs';
import { isValidHostName } from '../helpers/isValidHostName';
import { withCors } from '../helpers/withCors';
import { proxyRequest } from '../helpers/proxyRequest';
import { parseUrl } from '../helpers/parseUrl';

export function getHandler(options: CreateServerOptions, proxy: Proxy) {
  let corsbypass: Record<string, any> = {
    handleInitialRequest: null,
    getProxyForUrl: getProxyForUrl,
    maxRedirects: 5,
    originBlacklist: [],
    originWhitelist: [],
    checkRateLimit: null,
    redirectSameOrigin: false,
    requireHeader: null,
    removeHeaders: [],
    setHeaders: {},
    corsMaxAge: 0,
  };

  Object.keys(corsbypass).forEach((option) => {
    if (Object.prototype.hasOwnProperty.call(options, option)) {
      (corsbypass as any)[option] = (options as any)[option];
    }
  });

  if (corsbypass.requireHeader) {
    if (typeof corsbypass.requireHeader === 'string') {
      corsbypass.requireHeader = [
        String(corsbypass.requireHeader).toLowerCase(),
      ];
    } else if (
      !Array.isArray(corsbypass.requireHeader) ||
      corsbypass.requireHeader.length === 0
    ) {
      corsbypass.requireHeader = null;
    } else {
      corsbypass.requireHeader = corsbypass.requireHeader.map(function (
        headerName
      ) {
        return headerName.toLowerCase();
      });
    }
  }
  const hasRequiredHeaders = function (headers: object) {
    return (
      !corsbypass.requireHeader ||
      corsbypass.requireHeader.some((headerName: any) => {
        return Object.hasOwnProperty.call(headers, headerName);
      })
    );
  };

  return (req: Request, res: Response) => {
    req.corsbypassRequestState = {
      getProxyForUrl: corsbypass.getProxyForUrl,
      maxRedirects: corsbypass.maxRedirects,
      corsMaxAge: corsbypass.corsMaxAge,
      location: {},
      proxyBaseUrl: '',
      redirectCount_: 1,
    };

    const cors_headers = withCors({}, req);
    if (req.method === 'OPTIONS') {
      // Pre-flight request. Reply successfully:
      res.writeHead(200, cors_headers);
      res.end();
      return;
    }

    const location = parseUrl((req.url || '').slice(1));

    if (
      corsbypass.handleInitialRequest &&
      corsbypass.handleInitialRequest(req, res, location)
    ) {
      return;
    }

    if (!location) {
      // Special case http:/notenoughslashes, because new users of the library frequently make the
      // mistake of putting this application behind a server/router that normalizes the URL.
      // See https://github.com/Rob--W/cors-anywhere/issues/238#issuecomment-629638853
      if (/^\/https?:\/[^/]/i.test(req.url || '')) {
        res.writeHead(400, 'Missing slash', cors_headers);
        res.end(
          'The URL is invalid: two slashes are needed after the http(s):.'
        );
        return;
      }
      // Invalid API call. Show how to correctly use the API
      renderDocs(cors_headers, res);
      return;
    }

    if (location.host === 'iscorsneeded') {
      // Is CORS needed? This path is provided so that API consumers can test whether it's necessary
      // to use CORS. The server's reply is always No, because if they can read it, then CORS headers
      // are not necessary.
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('no');
      return;
    }

    if (Number(location.port) > 65535) {
      // Port is higher than 65535
      res.writeHead(400, 'Invalid port', cors_headers);
      res.end('Port number too large: ' + location.port);
      return;
    }

    if (
      !/^\/https?:/.test(req.url || '') &&
      !isValidHostName(location.hostname || '')
    ) {
      // Don't even try to proxy invalid hosts (such as /favicon.ico, /robots.txt)
      res.writeHead(404, 'Invalid host', cors_headers);
      res.end('Invalid host: ' + location.hostname);
      return;
    }

    if (!hasRequiredHeaders(req.headers)) {
      res.writeHead(400, 'Header required', cors_headers);
      res.end(
        'Missing required request header. Must specify one of: ' +
          corsbypass.requireHeader
      );
      return;
    }

    const origin = req.headers.origin || '';
    if (corsbypass.originBlacklist.indexOf(origin) >= 0) {
      res.writeHead(403, 'Forbidden', cors_headers);
      res.end(
        'The origin "' +
          origin +
          '" was blacklisted by the operator of this proxy.'
      );
      return;
    }

    if (
      corsbypass.originWhitelist.length &&
      corsbypass.originWhitelist.indexOf(origin) === -1
    ) {
      res.writeHead(403, 'Forbidden', cors_headers);
      res.end(
        'The origin "' +
          origin +
          '" was not whitelisted by the operator of this proxy.'
      );
      return;
    }

    const rateLimitMessage =
      corsbypass.checkRateLimit && corsbypass.checkRateLimit(origin);
    if (rateLimitMessage) {
      res.writeHead(429, 'Too Many Requests', cors_headers);
      res.end(
        'The origin "' +
          origin +
          '" has sent too many requests.\n' +
          rateLimitMessage
      );
      return;
    }

    if (
      corsbypass.redirectSameOrigin &&
      origin &&
      location.href[origin.length] === '/' &&
      location.href.lastIndexOf(origin, 0) === 0
    ) {
      // Send a permanent redirect to offload the server. Badly coded clients should not waste our resources.
      cors_headers.vary = 'origin';
      cors_headers['cache-control'] = 'private';
      cors_headers.location = location.href;
      res.writeHead(301, 'Please use a direct request', cors_headers);
      res.end();
      return;
    }

    const isRequestedOverHttps =
      (req.connection as any).encrypted ||
      /^\s*https/.test((req as any).headers['x-forwarded-proto']);
    const proxyBaseUrl =
      (isRequestedOverHttps ? 'https://' : 'http://') + req.headers.host;

    corsbypass.removeHeaders.forEach(function (header: string) {
      delete req.headers[header];
    });

    Object.keys(corsbypass.setHeaders).forEach(function (header) {
      req.headers[header] = corsbypass.setHeaders[header];
    });

    req.corsbypassRequestState.location = location;
    req.corsbypassRequestState.proxyBaseUrl = proxyBaseUrl;

    proxyRequest(req, res, proxy);
  };
}
