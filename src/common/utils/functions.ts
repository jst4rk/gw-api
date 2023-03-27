import { isEmpty, isNil } from 'ramda';
import { VALID_IPV4 } from './regex';

export function isValidIPv4(ipAddress: string) {
  return VALID_IPV4.test(ipAddress);
}

export function isEmptyOrNil(value: unknown) {
  return isEmpty(value) || isNil(value);
}
