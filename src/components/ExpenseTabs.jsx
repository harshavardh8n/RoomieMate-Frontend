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
        {roomieNames.map((roomie, index) => (
          <li key={roomie.userId || roomie.id || roomie._id || index} className="me-2">
            <span
              className="inline-block p-2 border-b-2 border-[#809539] text-[#809539] font-medium text-xs rounded-t-lg bg-gray-50"
            >
              {roomie.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTab;
