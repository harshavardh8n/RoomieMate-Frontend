import React from 'react';

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

const Expense = ({
  amount,
  description,
  expenseDesc,
  category = 'OTHER',
  payer,
  payername,
  splits,
  splittersIds,
  share,
  createdAt,
}) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const displayDesc = description || expenseDesc || 'Expense';
  const displayPayer = payer?.name || payername || 'Unknown';
  const displayCategory = category || 'OTHER';
  const badgeClass = CATEGORY_COLORS[displayCategory] || CATEGORY_COLORS.OTHER;
  const icon = CATEGORY_ICONS[displayCategory] || '📦';

  // Support splits from Spring Boot DTO or legacy splittersIds
  let splitMembers = [];
  if (Array.isArray(splits) && splits.length > 0) {
    splitMembers = splits.map((s) => s.user?.name || 'Member');
  } else if (Array.isArray(splittersIds) && splittersIds.length > 0) {
    splitMembers = splittersIds.map((s) => (typeof s === 'string' ? s : s.name || 'Member'));
  }

  const numAmount = Number(amount || 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium inline-flex items-center gap-1 ${badgeClass}`}>
              <span>{icon}</span> {displayCategory}
            </span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
          <h4 className="font-semibold text-gray-800 text-base">{displayDesc}</h4>
          <p className="text-xs text-gray-500">
            Paid by <strong className="text-gray-700">{displayPayer}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-gray-900 block">
            ${numAmount.toFixed(2)}
          </span>
          {share !== undefined && (
            <span className="text-[11px] text-gray-400">Share: ${Number(share).toFixed(2)}</span>
          )}
        </div>
      </div>

      {splitMembers.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-600 flex flex-wrap items-center gap-1.5">
          <span className="text-gray-400 font-medium">Split with:</span>
          {splitMembers.map((name, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[11px]"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expense;
