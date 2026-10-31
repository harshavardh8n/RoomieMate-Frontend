import React, { useState, useEffect } from 'react';
import Expense from './Expense';
import ExpenseTabs from './ExpenseTabs';
import { expenseApi } from '../api/roomieApi';

const ExpenseBox = ({ refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const roomId = localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');
      if (!roomId) {
        setLoading(false);
        return;
      }

      const data = await expenseApi.getAllExpenses(roomId);
      // data can be array directly or { content: [...] } if paginated
      const list = Array.isArray(data) ? data : data?.content || [];
      setExpenses(list);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Could not load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const categories = ['ALL', 'FOOD', 'GROCERIES', 'RENT', 'UTILITIES', 'ENTERTAINMENT', 'SHOPPING', 'OTHER'];

  const filteredExpenses = filterCategory === 'ALL'
    ? expenses
    : expenses.filter((e) => (e.category || 'OTHER') === filterCategory);

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-100 gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📜</span> Room Expense History
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Total {expenses.length} recorded expense{expenses.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>
          <button
            onClick={fetchExpenses}
            className="text-xs text-blue-600 hover:underline px-2 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="my-3">
        <ExpenseTabs />
      </div>

      {error && <p className="text-red-500 text-xs my-2">{error}</p>}

      <div className="max-h-[65vh] overflow-y-auto space-y-3 pr-1 mt-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8 text-sm">Loading expenses...</p>
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => {
            const expId = expense.id || expense._id;
            return (
              <Expense
                key={expId}
                amount={expense.amount}
                description={expense.description}
                expenseDesc={expense.expenseDesc}
                category={expense.category}
                payer={expense.payer}
                payername={expense.payername || expense.payerId?.name}
                share={expense.share}
                splits={expense.splits}
                splittersIds={expense.splittersIds}
                createdAt={expense.createdAt}
              />
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            <span className="text-3xl block mb-2">🧾</span>
            {filterCategory === 'ALL' ? 'No expenses recorded yet.' : `No ${filterCategory} expenses found.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseBox;
