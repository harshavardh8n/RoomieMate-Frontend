import React, { useState } from 'react';
import { expenseApi } from '../api/roomieApi';

const CATEGORIES = ['FOOD', 'GROCERIES', 'RENT', 'UTILITIES', 'ENTERTAINMENT', 'SHOPPING', 'OTHER'];

export default function AddExpenseModal({ roomId: propRoomId, members = [], onClose, onExpenseAdded }) {
  const roomId = propRoomId || localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [selectedSplitters, setSelectedSplitters] = useState(
    members.map((m) => m.id || m._id)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSplitter = (id) => {
    if (selectedSplitters.includes(id)) {
      if (selectedSplitters.length === 1) {
        setError('At least one member must be selected to split.');
        return;
      }
      setSelectedSplitters(selectedSplitters.filter((sId) => sId !== id));
    } else {
      setSelectedSplitters([...selectedSplitters, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    if (selectedSplitters.length === 0) {
      setError('Please select at least one roommate to split with.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await expenseApi.createExpense(roomId, {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        splittersIds: selectedSplitters,
      });
      alert('Expense added successfully!');
      if (onExpenseAdded) onExpenseAdded();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err?.message || 'Error creating expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-[#EFF3EA] px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Add New Expense</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. WiFi Bill, Groceries at Trader Joe's"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#809539]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#809539]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#809539]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">
              Split with ({selectedSplitters.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
              {members.map((m) => {
                const memberId = m.id || m._id;
                const isSelected = selectedSplitters.includes(memberId);
                return (
                  <button
                    type="button"
                    key={memberId}
                    onClick={() => toggleSplitter(memberId)}
                    className={`px-3 py-2 text-xs rounded-lg border text-left font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#809539] text-white border-[#809539]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-[#809539] hover:bg-[#6c7f30] text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Splitting...' : 'Split Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

