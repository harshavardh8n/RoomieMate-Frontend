import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { roommateExpenseAtom } from '../state/atoms/RoommateExpense';

const ExpenseTab = () => {
  const roommateNames = useRecoilValue(roommateExpenseAtom);
  const [roomieNames, setRoomieNames] = useState([]);

  useEffect(() => {
    if (roommateNames && roommateNames.roommateBalances) {
      setRoomieNames(roommateNames.roommateBalances);
    }
  }, [roommateNames]);

  // Conditional rendering for empty list
  if (!roomieNames.length) {
    return (
      <div className="text-center text-gray-500">
        No roommates available.
      </div>
    );
  }

  return (
    <div className="flex flex-row mt-5">
      <ul className="flex flex-wrap text-sm font-medium text-center text-black border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {roomieNames.map((roomie) => (
          <li key={roomie.userId} className="me-2">
            <a
              href="#"
              aria-current="page" // Add the condition to check if it's the active one
              className="inline-block p-2 border-2 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 active:bg-gray-800"
            >
              {roomie.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTab;
