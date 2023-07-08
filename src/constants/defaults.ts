export const defaultOptions = {
  httpProxyOptions: {
    xfwd: true,
    secure: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
  },
};
