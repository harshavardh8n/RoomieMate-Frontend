import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AddExpense from '../components/AddExpense';
import CalculateNet from '../components/CalculateNet';
import ExpenseBox from '../components/ExpenseBox';
import Owe from '../components/Owe';
import SimplifiedSettlements from '../components/SimplifiedSettlements';
import RoomAnalyticsWidget from '../components/RoomAnalyticsWidget';

const Expenses = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const roomId = localStorage.getItem('roomId') || localStorage.getItem('currentRoomId');

  return (
    <div className="bg-[#EFF3EA] min-h-screen pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <NavLink
              to="/home"
              className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>←</span> Back to Dashboard
            </NavLink>
            <h1 className="text-2xl font-bold text-[#809539]">RoomieMate Expenses</h1>
          </div>
          <div className="text-xs text-gray-500 font-mono bg-gray-100 px-3 py-1.5 rounded-lg">
            Room: {roomId ? `${roomId.substring(0, 8)}...` : 'Active'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Top 2-Column Grid: Form + Balances */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Add Expense Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <AddExpense onExpenseAdded={handleDataRefresh} />

            {/* Feature 2: Spending Analytics Widget */}
            <RoomAnalyticsWidget roomId={roomId} refreshTrigger={refreshKey} />
          </div>

          {/* Right Column: Net Balances & Settlements (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Net Balance & Roommate Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CalculateNet refreshTrigger={refreshKey} />
              <Owe onSettled={handleDataRefresh} />
            </div>

            {/* Feature 1: Min-Cash-Flow Debt Simplification Card */}
            <SimplifiedSettlements roomId={roomId} onSettled={refreshKey} />
          </div>
        </div>

        {/* Bottom Full-Width Section: All Expenses Log */}
        <section className="pt-4">
          <ExpenseBox refreshTrigger={refreshKey} />
        </section>
      </main>
    </div>
  );
};

export default Expenses;
