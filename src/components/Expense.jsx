import React from 'react';

const Expense = ({ amount, expenseDesc, payername, share, splittersIds,createdAt }) => {

  const formattedDate = new Date(createdAt).toLocaleString(); // Default format


  return (
    <div className="h-auto bg-white rounded-lg m-2 p-3 shadow-md">
      <p>
        <strong>Amount:</strong> {amount}
      </p>
      <p>
        <strong>Description:</strong> {expenseDesc}
      </p>
      <p>
        <strong>Payer:</strong> {payername}
      </p>
      <p>
        <strong>Share:</strong> {share}
      </p>
      <p>
        <strong>Splitters:</strong>{' '}
        {splittersIds && splittersIds.length > 0 ? (
          splittersIds.map((splitter, index) => (
            <span key={splitter._id}>
              {splitter.name}
              {index < splittersIds.length - 1 ? ', ' : ''}
            </span>
          ))
        ) : (
          'None'
        )}
      </p>
      <div className="mt-2 text-right text-xs text-gray-400">
        <span>Created At: {formattedDate}</span>
      </div>
    </div>
  );
};

export default Expense;
