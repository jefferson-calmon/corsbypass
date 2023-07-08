import { createServer } from './server';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 9090;

createServer({
  originBlacklist: [],
  originWhitelist: [],
  requireHeader: [],
  removeHeaders: ['cookie', 'cookie2'],
  redirectSameOrigin: true,
}).listen(port, host, () =>
  console.log('Running CORS Bypass on ' + host + ':' + port)
);
