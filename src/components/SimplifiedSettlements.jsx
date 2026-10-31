import React, { useEffect, useState } from 'react';
import { settlementApi } from '../api/roomieApi';

export default function SimplifiedSettlements({ roomId: propRoomId, onSettled }) {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomId = propRoomId || localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');

  const fetchSettlements = () => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    settlementApi.getSimplifiedDebts(roomId)
      .then((data) => {
        setSettlements(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching simplified debts:', err);
        setError('Could not calculate simplified debts.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettlements();
  }, [roomId, onSettled]);

  if (!roomId) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-[#F9FAFB] p-5 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm">Calculating optimal transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800 text-base flex items-center gap-1.5">
          <span>⚡</span> Min-Cash-Flow Debt Simplification
        </h4>
        <button
          onClick={fetchSettlements}
          className="text-xs text-blue-600 hover:underline cursor-pointer"
        >
          Refresh
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Reduces multi-roommate circular debts to the fewest possible transactions using graph optimization:
      </p>

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : settlements.length === 0 ? (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-sm font-medium text-[#10B981]">🎉 All room debts are completely settled!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {settlements.map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-xs hover:border-blue-300 transition-colors"
            >
              <div className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{tx.fromUser?.name || 'Someone'}</span>
                <span className="text-gray-400 mx-1.5">pays</span>
                <span className="font-semibold text-gray-900">{tx.toUser?.name || 'Someone'}</span>
              </div>
              <span className="font-bold text-blue-600 text-sm">
                ${Number(tx.amount || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

