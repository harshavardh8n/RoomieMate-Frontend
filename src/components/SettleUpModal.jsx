import React, { useState } from 'react';
import { settlementApi } from '../api/roomieApi';

export default function SettleUpModal({ roomId: propRoomId, roommate, onClose, onSettled }) {
  const roomId = propRoomId || localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');
  const targetId = roommate?.userId || roommate?.id || roommate?._id;
  const initialAmount = Math.abs(Number(roommate?.netBalance || roommate?.netWithUser || 0));

  const [amount, setAmount] = useState(initialAmount ? initialAmount.toFixed(2) : '');
  const [notes, setNotes] = useState('Settled via UPI / Venmo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!roommate) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await settlementApi.recordPayment(roomId, targetId, parseFloat(amount), notes);
      alert('Payment recorded successfully! Balances have been updated.');
      if (onSettled) onSettled();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(err?.message || 'Error processing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-[#EFF3EA] px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Settle Up with {roommate?.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#809539]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Payment Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Settled via UPI, Venmo, Cash"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#809539]"
            />
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
              className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

