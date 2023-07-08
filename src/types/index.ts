import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';

export type Proxy = httpProxy<
  http.IncomingMessage,
  http.ServerResponse<http.IncomingMessage>
>;

export type Request = InstanceType<typeof http.IncomingMessage> & {
  corsbypassRequestState?: {
    getProxyForUrl: Function;
    maxRedirects: number;
    corsMaxAge: number;
    location: Record<string, any>;
    redirectCount_: number;
    proxyBaseUrl: string;
  };
};

export type Response = InstanceType<typeof http.ServerResponse> & {
  req: Request;
};

export type Headers = Record<string, any>;

export interface CreateServerOptions {
  originBlacklist?: string[];
  originWhitelist?: string[];
  requireHeader?: string[];
  checkRateLimit?: Function;
  removeHeaders?: string[];
  redirectSameOrigin?: boolean;
  httpProxyOptions?: httpProxy.ServerOptions;
  httpsOptions?: https.ServerOptions;
}
