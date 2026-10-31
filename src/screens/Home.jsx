import React from 'react';
import AddSticker from '../components/AddSticker';
import Attachment from '../components/Attachment';
import FeatureBox from '../components/FeatureBox';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { roomIdAtom } from '../state/atoms/roomIdAtom';
import { userState } from '../state/atoms/userAtom';
import Roommates from '../components/Roommates';

const Home = () => {
  const roomId = useRecoilValue(roomIdAtom);
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const setRoomId = useSetRecoilState(roomIdAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roomId');
    localStorage.removeItem('currentRoomId');
    setUser(null);
    setRoomId(null);
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full flex lg:flex-row flex-col min-h-screen">
        {/* Left Section */}
        <div className="lg:w-1/2 pt-4 pb-8 bg-gray-100 flex flex-col justify-between">
          <div>
            <div className="w-3/4 mx-auto flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#809539]">RoomieMate</h1>
              <div className="flex items-center gap-3">
                <NavLink
                  to="/createroom"
                  className="text-xs text-gray-600 hover:text-gray-900 border border-gray-300 px-2.5 py-1 rounded-lg bg-white"
                >
                  Manage Rooms
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="w-3/4 mx-auto space-y-2">
              <NavLink to="/expenses">
                <div className="p-3.5 rounded-xl m-2 bg-[#809539] text-white font-medium cursor-pointer hover:bg-[#6e8030] duration-300 shadow-sm flex justify-between items-center">
                  <span>💰 Expense Tracking & Settlements</span>
                  <span>→</span>
                </div>
              </NavLink>

              <FeatureBox fname="Group Chat (In progress)" />
              <FeatureBox fname="Find a Roommate (In progress)" />
              <FeatureBox fname="Exchange Items (In progress)" />
            </div>
          </div>

          <div className="mt-6">
            <Roommates />
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 bg-[#D9DFC6] lg:rounded-l-3xl flex flex-col p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">Room Board</h3>
            <AddSticker />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[85vh]">
            <Attachment />
            <Attachment />
            <Attachment />
            <Attachment />
            <Attachment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
