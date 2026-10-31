import { atom } from 'recoil';

export const membersAtom = atom({
    key: 'membersAtom', // Unique key
    default: [],        // Default value
});