import httpProxy from 'http-proxy';
import https from 'https';
import http from 'http';

import { CreateServerOptions, Response } from './types';
import { getHandler } from './helpers/getHandler';
import { defaultOptions } from './constants/defaults';
import { onProxyError } from './helpers/onProxyError';

export function createServer(options: CreateServerOptions) {
  options = Object.assign(defaultOptions, options);

  const proxy = httpProxy.createServer(options.httpProxyOptions);
  const requestHandler = getHandler(options, proxy);

  const server = options.httpsOptions
    ? https.createServer(options.httpsOptions, requestHandler)
    : http.createServer(requestHandler);

  proxy.on('error', (err, req, res) => onProxyError(err, req, res as Response));

  return server;
}
