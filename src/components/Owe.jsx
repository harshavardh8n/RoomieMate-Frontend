import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { roommateExpenseAtom } from '../state/atoms/RoommateExpense';
import SettleUpModal from './SettleUpModal';

const Owe = ({ onSettled }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedRoommateToPay, setSelectedRoommateToPay] = useState(null);
  const RoommateExpense = useRecoilValue(roommateExpenseAtom);

  useEffect(() => {
    if (RoommateExpense && RoommateExpense.roommateBalances) {
      setExpenses(RoommateExpense.roommateBalances);
    }
  }, [RoommateExpense]);

  const handleNotify = (exp) => {
    alert(`Payment reminder sent to ${exp.name} for $${Math.abs(Number(exp.netBalance ?? exp.netWithUser ?? 0)).toFixed(2)}!`);
  };

  const getBalance = (exp) => Number(exp.netBalance ?? exp.netWithUser ?? 0);

  const peopleWhoOweYou = expenses.filter((exp) => getBalance(exp) > 0);
  const peopleYouOwe = expenses.filter((exp) => getBalance(exp) < 0);

  return (
    <div className="bg-[#F9FAF4] p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* People who owe the user */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2 flex items-center gap-1.5">
          <span>💚</span> You'll get money from:
        </h3>
        {peopleWhoOweYou.length > 0 ? (
          <div className="space-y-2">
            {peopleWhoOweYou.map((exp, idx) => {
              const bal = getBalance(exp);
              const keyId = exp.userId || exp.id || exp._id || idx;
              return (
                <div
                  key={keyId}
                  className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs flex justify-between items-center"
                >
                  <div>
                    <span className="text-gray-900 font-semibold text-sm">{exp.name}</span>
                    <span className="text-xs text-gray-400 block">{exp.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#10B981] font-bold text-sm">
                      +${bal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleNotify(exp)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-xs"
                    >
                      Notify
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 p-2 bg-white rounded-lg border border-gray-100 text-center">
            No one owes you money right now.
          </p>
        )}
      </div>

      {/* People user owes */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2 flex items-center gap-1.5">
          <span>🔴</span> You'll pay money to:
        </h3>
        {peopleYouOwe.length > 0 ? (
          <div className="space-y-2">
            {peopleYouOwe.map((exp, idx) => {
              const bal = getBalance(exp);
              const keyId = exp.userId || exp.id || exp._id || idx;
              return (
                <div
                  key={keyId}
                  className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs flex justify-between items-center"
                >
                  <div>
                    <span className="text-gray-900 font-semibold text-sm">{exp.name}</span>
                    <span className="text-xs text-gray-400 block">{exp.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#EF4444] font-bold text-sm">
                      -${Math.abs(bal).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setSelectedRoommateToPay(exp)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-xs"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 p-2 bg-white rounded-lg border border-gray-100 text-center">
            You don't owe anyone money right now.
          </p>
        )}
      </div>

      {/* Settle Up Modal */}
      {selectedRoommateToPay && (
        <SettleUpModal
          roommate={selectedRoommateToPay}
          onClose={() => setSelectedRoommateToPay(null)}
          onSettled={() => {
            if (onSettled) onSettled();
          }}
        />
      )}
    </div>
  );
};

export default Owe;
