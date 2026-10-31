import React from 'react';
import { NavLink } from 'react-router-dom';
import Create from '../components/Create';
import Invitation from '../components/Invitation';

const CreateRoom = () => {
  const hasRoom = !!(localStorage.getItem('roomId') || localStorage.getItem('currentRoomId'));

  return (
    <div className="min-h-screen bg-[#EFF3EA] flex flex-col">
      {hasRoom && (
        <div className="bg-white px-6 py-3 border-b border-gray-200">
          <NavLink
            to="/home"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-1.5"
          >
            <span>←</span> Back to Dashboard
          </NavLink>
        </div>
      )}
      <div className="w-full flex-1 flex lg:flex-row flex-col">
        <div className="lg:w-1/2 w-full bg-[#EFF3EA]">
          <Create />
        </div>
        <div className="lg:w-1/2 w-full lg:rounded-l-3xl bg-[#D9DFC6]">
          <Invitation />
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
