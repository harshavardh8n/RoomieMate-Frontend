import React, { useState, useEffect } from 'react';
import { roommateExpenseAtom } from '../state/atoms/RoommateExpense';
import { useSetRecoilState } from 'recoil';
import { expenseApi } from '../api/roomieApi';

const CalculateNet = ({ refreshTrigger }) => {
  const [netMoney, setNetMoney] = useState(0);
  const [loading, setLoading] = useState(true);
  const setRoommateExpense = useSetRecoilState(roommateExpenseAtom);

  const fetchNetBalance = async () => {
    try {
      setLoading(true);
      const roomId = localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');
      if (!roomId) {
        setLoading(false);
        return;
      }

      const data = await expenseApi.getBalances(roomId);
      // data = BalanceSummaryResponse { userTotalNetBalance, roommateBalances, ... }
      if (data) {
        const total = Number(data.userTotalNetBalance ?? data.userNetBalance ?? 0);
        setNetMoney(total);
        setRoommateExpense({
          userNetBalance: total,
          userTotalNetBalance: total,
          roommateBalances: data.roommateBalances || [],
        });
      }
    } catch (error) {
      console.error('Error fetching net balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetBalance();
  }, [refreshTrigger]);

  const numNet = Number(netMoney || 0);

  return (
    <div className="bg-[#F7F9F4] p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-[#2A4D2F] uppercase tracking-wide">
          Your Net Balance
        </h2>
        <button
          onClick={fetchNetBalance}
          className="text-xs text-blue-600 hover:underline cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <p className="text-xs text-[#5A6B47]">
        Overall balance across all active room expenses:
      </p>

      <div className="flex flex-col items-center justify-center bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        {loading ? (
          <span className="text-sm text-gray-400">Updating balances...</span>
        ) : (
          <>
            <span
              className="text-4xl font-extrabold"
              style={{ color: numNet >= 0 ? '#10B981' : '#EF4444' }}
            >
              {numNet >= 0 ? `+$${numNet.toFixed(2)}` : `-$${Math.abs(numNet).toFixed(2)}`}
            </span>
            <span className="text-xs text-gray-500 mt-1 font-medium">
              {numNet > 0
                ? 'You are owed money overall'
                : numNet < 0
                ? 'You owe money overall'
                : 'All room expenses are settled'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default CalculateNet;
