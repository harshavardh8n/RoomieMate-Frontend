import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { roommateExpenseAtom } from '../state/atoms/RoommateExpense';

const Owe = () => {
  const [expenses, setExpenses] = useState([]);
  const RoommateExpense = useRecoilValue(roommateExpenseAtom);

  // Function to filter and set the expenses
  const setNet = () => {
    setExpenses(RoommateExpense.roommateBalances || []);
  };

  useEffect(() => {
    setNet(); // Set expenses whenever RoommateExpense changes
  }, [RoommateExpense]);

  const renderExpenses = (condition) => {
    return expenses
      .filter((exp) => condition(exp.netWithUser)) // Filter based on netWithUser
      .map((exp, index) => (
        <div key={exp.userId || index} className="p-4 mt-4 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">
              {exp.name}: <span className="text-green-600">{Math.abs(exp.netWithUser).toFixed(2)}</span>
            </span>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
              {exp.netWithUser > 0 ? 'Notify' : 'Pay Now'}
            </button>
          </div>
        </div>
      ));
  };

  return (
    <div className="min-h-[50vh] bg-[#F9FAF4] p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">You'll get Money from:</h3>
        {expenses.length > 0 ? renderExpenses((net) => net > 0) : <p className="text-gray-500">No one owes you money.</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">You'll Pay Money To:</h3>
        {expenses.length > 0 ? renderExpenses((net) => net < 0) : <p className="text-gray-500">You don’t owe anyone money.</p>}
      </div>
    </div>
  );
};

export default Owe;
