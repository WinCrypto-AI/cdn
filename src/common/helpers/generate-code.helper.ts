import { v4 } from 'uuid';
import * as nanoid from 'nanoid';
const { customAlphabet } = nanoid;
const uuidNoDash = () => {
  return v4().replace(/-/g, '').toUpperCase();
};

const generateReferralCode = () => {
  return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')(8);
};
export const generateCodeHelper = {
  uuidNoDash,
  generateReferralCode,
};
