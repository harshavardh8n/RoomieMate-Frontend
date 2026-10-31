import { atom } from 'recoil';

export const roommateExpenseAtom = atom({
  key: 'roommateExpenseAtom', // Unique key for the atom
  default: {
    userNetBalance: 0, // Default value for the user's net balance
    roommateBalances: [], // Default empty array for roommate balances
  },
});
