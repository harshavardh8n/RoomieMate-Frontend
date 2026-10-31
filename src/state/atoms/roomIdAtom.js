import { atom } from 'recoil';

export const roomIdAtom = atom({
  key: 'roomIdAtom', // unique ID for this atom
  default: null,   // default value (e.g., no user is logged in)
});