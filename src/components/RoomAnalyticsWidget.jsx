import React, { useEffect, useState } from 'react';
import { expenseApi } from '../api/roomieApi';

const CATEGORY_COLORS = {
  FOOD: 'bg-orange-100 text-orange-700 border-orange-200',
  GROCERIES: 'bg-green-100 text-green-700 border-green-200',
  RENT: 'bg-purple-100 text-purple-700 border-purple-200',
  UTILITIES: 'bg-blue-100 text-blue-700 border-blue-200',
  ENTERTAINMENT: 'bg-pink-100 text-pink-700 border-pink-200',
  SHOPPING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  OTHER: 'bg-gray-100 text-gray-700 border-gray-200',
};

const CATEGORY_ICONS = {
  FOOD: '🍔',
  GROCERIES: '🛒',
  RENT: '🏠',
  UTILITIES: '💡',
  ENTERTAINMENT: '🎬',
  SHOPPING: '🛍️',
  OTHER: '📦',
};

export default function RoomAnalyticsWidget({ roomId: propRoomId, refreshTrigger }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const roomId = propRoomId || localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    expenseApi.getAnalytics(roomId)
      .then((data) => setAnalytics(data))
      .catch((err) => console.error('Error fetching analytics:', err))
      .finally(() => setLoading(false));
  }, [roomId, refreshTrigger]);

  if (!roomId || (!loading && !analytics)) return null;

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm">Loading room analytics...</p>
      </div>
    );
  }

  const categoryEntries = Object.entries(analytics.spendingByCategory || {});
  const totalSpend = Number(analytics.totalExpenses || 0);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="font-semibold text-gray-800 text-base flex items-center gap-1.5">
          <span>📊</span> Spending Analytics
        </h4>
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
          {analytics.totalExpenseCount || 0} expenses
        </span>
      </div>

      <div className="bg-[#F8FAF6] p-3.5 rounded-lg border border-[#E2EBD5]">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Total Room Spend</span>
        <div className="text-2xl font-bold text-[#2A4D2F] mt-0.5">
          ${totalSpend.toFixed(2)}
        </div>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">By Category</h5>
        {categoryEntries.length === 0 ? (
          <p className="text-xs text-gray-400">No categorized expenses yet.</p>
        ) : (
          <div className="space-y-2">
            {categoryEntries.map(([category, amount]) => {
              const numAmount = Number(amount || 0);
              const percentage = totalSpend > 0 ? ((numAmount / totalSpend) * 100).toFixed(0) : 0;
              const badgeClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
              const icon = CATEGORY_ICONS[category] || '📦';

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded-md border font-medium inline-flex items-center gap-1 ${badgeClass}`}>
                      <span>{icon}</span> {category}
                    </span>
                    <span className="font-semibold text-gray-700">
                      ${numAmount.toFixed(2)} <span className="text-gray-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#809539] h-1.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {analytics.memberSpending && analytics.memberSpending.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Member Breakdown</h5>
          <div className="space-y-1.5">
            {analytics.memberSpending.map((ms, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-md">
                <span className="font-medium text-gray-800">{ms.user?.name || 'Member'}</span>
                <span className="text-gray-600">
                  Paid: <strong className="text-gray-900">${Number(ms.totalPaid || 0).toFixed(2)}</strong> | Share: ${Number(ms.totalShareOwed || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

