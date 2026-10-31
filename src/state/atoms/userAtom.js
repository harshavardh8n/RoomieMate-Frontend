import { atom } from 'recoil';

export const userState = atom({
  key: 'userState', // unique ID for this atom
  default: null,    // default value (e.g., no user is logged in)
});