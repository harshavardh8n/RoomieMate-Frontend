import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Expense from './Expense';
import ExpenseTabs from './ExpenseTabs';
import { backendPath } from '../config';

const ExpenseBox = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendPath}expenses/room`, {
          headers: {
            Authorization: token,
          },
        });
        setExpenses(response.data); // Assuming the response data is an array of expenses
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className=" mx-auto p-5  bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <ExpenseTabs />
      </div>
      <div className="max-h-[75vh] overflow-auto bg-gray-50 rounded-lg p-4 shadow-inner">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <Expense
              key={expense._id} // Assuming each expense has a unique _id
              amount={expense.amount}
              expenseDesc={expense.expenseDesc}
              payername={expense.payerId.name} // Adjust based on your backend response
              share={expense.share}
              splittersIds={expense.splittersIds}
              createdAt = {expense.createdAt}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseBox;
