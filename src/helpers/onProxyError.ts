import { Request, Response } from '../types';

export function onProxyError(err: Error, req: Request, res: Response) {
  if (res.headersSent) {
    if (res.writableEnded === false) {
      res.end();
    }
    return;
  }

  const headerNames = res.getHeaderNames
    ? res.getHeaderNames()
    : Object.keys((res as any)._headers || {});

  headerNames.forEach(function (name) {
    res.removeHeader(name);
  });

  res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
  res.end('Not found because of proxy error: ' + err);
}
