import net from 'net';

import { regexp_tld } from '../constants/regex-top-level-domain';

export function isValidHostName(hostname: string) {
  return !!(
    regexp_tld.test(hostname) ||
    net.isIPv4(hostname) ||
    net.isIPv6(hostname)
  );
}
