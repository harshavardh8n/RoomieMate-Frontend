import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendPath } from '../config';
import { roommateExpenseAtom } from '../state/atoms/RoommateExpense';
import { useSetRecoilState } from 'recoil';

const CalculateNet = () => {
  const [NetMoney, setNetMoney] = useState(0); // Initialize with 0
  const setRoommateExpense = useSetRecoilState(roommateExpenseAtom);

  useEffect(() => {
    const fetchNetBalance = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await axios.get(`${backendPath}expenses/net-balance`, {
          headers: {
            Authorization: token,
          },
        });
        console.log('Net balance response:', response.data); // Debug log
        setRoommateExpense(response.data)
        setNetMoney(response.data.userNetBalance); // Set the net balance
      } catch (error) {
        console.error('Error fetching net balance:', error);
      }
    };

    fetchNetBalance();
  }, []); // Runs once when the component mounts

  return (
    <div className="min-h-[20vh] bg-[#F7F9F4] p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-[#2A4D2F]">Your Net Transfer</h2>
      <p className="text-lg text-[#5A6B47]">Your current net balance is:</p>
      <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md text-2xl font-bold text-[#3A6F3C]">
        {NetMoney >= 0 ? (
          <span>+{NetMoney}</span>
        ) : (
          <span className="text-red-500">-{Math.abs(NetMoney)}</span>
        )}
      </div>
    </div>
  );
};

export default CalculateNet;
