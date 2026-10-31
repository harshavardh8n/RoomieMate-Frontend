import React from 'react';
import AddExpense from '../components/AddExpense';
import CalculateNet from '../components/CalculateNet';
import ExpenseBox from '../components/ExpenseBox';
import Owe from '../components/Owe';

const Expenses = () => {
  return (
    <>
      <div className='bg-[#EFF3EA]'>
        {/* Main container */}
        <div className='lg:w-full flex lg:flex-row flex-col min-h-screen'>
          
          {/* Left section (Expense Box) */}
          <div className='lg:w-[45%] pt-10 bg-[#EFF3EA] px-4 lg:px-8'>
            <h1 className='text-3xl font-semibold text-[#809539] ml-24'>Expenses</h1>
            <div className='w-full lg:w-4/5 m-auto min-h-[70vh]'>
              
              <AddExpense />
            </div>
          </div>

          {/* Right section (Calculate Net and Owe) */}
          <div className='lg:w-1/2  rounded-l-3xl p-6'>
            <div className='flex flex-col space-y-8'>
              <CalculateNet />
              <Owe />
            </div>
          </div>
        </div>

        {/* Add Expense section */}
        <div className='bg-[#EFF3EA] pt-8 w-[90%] m-auto'>
          <div className='flex items-center'>
            <div className='w-full lg:w-full min-h-[60vh] p-34 rounded-xl p-6 m-auto'>
            <ExpenseBox />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expenses;
