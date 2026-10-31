import React, { useEffect, useState } from 'react';
import { expenseApi } from '../api/roomieApi';

export default function BalanceWidget({ roomId: propRoomId, refreshTrigger }) {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const roomId = propRoomId || localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    expenseApi.getBalances(roomId)
      .then((data) => setBalanceData(data))
      .catch((err) => console.error('Error fetching balances:', err))
      .finally(() => setLoading(false));
  }, [roomId, refreshTrigger]);

  if (!roomId || (!loading && !balanceData)) return null;

  if (loading) {
    return (
      <div className="bg-[#F7F9F4] p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm">Loading balances...</p>
      </div>
    );
  }

  const total = Number(balanceData.userTotalNetBalance || balanceData.userNetBalance || 0);
  const roommateBalances = balanceData.roommateBalances || [];

  return (
    <div className="bg-[#F7F9F4] p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6B47]">Your Net Balance</h3>
        <h1
          className="text-3xl font-extrabold mt-1"
          style={{ color: total >= 0 ? '#10B981' : '#EF4444' }}
        >
          {total >= 0 ? `+$${total.toFixed(2)}` : `-$${Math.abs(total).toFixed(2)}`}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {total > 0
            ? 'You are owed money overall'
            : total < 0
            ? 'You owe money overall'
            : 'You are completely settled up'}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <h4 className="text-xs font-semibold uppercase text-gray-600 mb-2">Roommate Breakdown</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {roommateBalances.length === 0 ? (
            <p className="text-xs text-gray-400">No roommate balance data available.</p>
          ) : (
            roommateBalances.map((rb) => {
              const bal = Number(rb.netBalance || rb.netWithUser || 0);
              const userId = rb.userId || rb.id || rb._id;
              return (
                <div
                  key={userId}
                  className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-gray-100"
                >
                  <span className="font-medium text-gray-800">{rb.name}</span>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: bal > 0 ? '#10B981' : bal < 0 ? '#EF4444' : '#6B7280',
                    }}
                  >
                    {bal > 0
                      ? `owes you $${bal.toFixed(2)}`
                      : bal < 0
                      ? `you owe $${Math.abs(bal).toFixed(2)}`
                      : 'Settled up'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

