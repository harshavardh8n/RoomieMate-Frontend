import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { membersAtom } from '../state/atoms/membersAtom';
import { roommateDetailsAtom } from '../state/atoms/membersName';
import { roomIdAtom } from '../state/atoms/roomIdAtom';
import { roomApi } from '../api/roomieApi';

const Roommates = () => {
  const recoilRoomId = useRecoilValue(roomIdAtom);
  const setMembers = useSetRecoilState(membersAtom);
  const setRoommateDetails = useSetRecoilState(roommateDetailsAtom);
  const setRecoilRoomId = useSetRecoilState(roomIdAtom);

  const [roommates, setRoommates] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRoommates = async () => {
    try {
      setLoading(true);
      setError(null);
      const activeRoomId =
        recoilRoomId ||
        localStorage.getItem('roomId') ||
        localStorage.getItem('currentRoomId');

      if (activeRoomId) {
        try {
          const room = await roomApi.getRoomDetails(activeRoomId);
          if (room) {
            setRoomName(room.name || 'Room');
            const members = room.members || [];
            setRoommates(members);
            setMembers(members);
            setRoommateDetails(members);
            setLoading(false);
            return;
          }
        } catch (detailErr) {
          console.warn('Could not fetch specific room details, falling back to user rooms', detailErr);
        }
      }

      // Fallback: Fetch user's rooms
      const rooms = await roomApi.getUserRooms();
      const roomList = Array.isArray(rooms) ? rooms : rooms?.rooms || [];

      if (roomList.length > 0) {
        const primaryRoom = roomList[0];
        const primaryId = primaryRoom.id || primaryRoom._id;
        setRoomName(primaryRoom.name || 'Room');
        const members = primaryRoom.members || [];
        setRoommates(members);
        setMembers(members);
        setRoommateDetails(members);

        if (primaryId) {
          localStorage.setItem('roomId', primaryId);
          localStorage.setItem('currentRoomId', primaryId);
          setRecoilRoomId(primaryId);
        }
      } else {
        setRoommates([]);
      }
    } catch (err) {
      console.error('Failed to fetch roommates:', err);
      setError('Failed to fetch roommates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoommates();
  }, [recoilRoomId]);

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center w-3/4 mx-auto mb-3">
        <h2 className="text-xl font-bold text-[#809539]">
          {roomName ? `${roomName} Roommates` : 'Roommates'}
        </h2>
        <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
          {roommates.length} members
        </span>
      </div>

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-400 text-xs">Loading roommates...</p>
      ) : roommates.length === 0 ? (
        <p className="text-center text-gray-400 text-xs">No roommates in this room yet.</p>
      ) : (
        <div className="w-3/4 mx-auto flex flex-col gap-2">
          {roommates.map((roomie) => {
            const memberId = roomie.id || roomie._id;
            return (
              <div
                key={memberId}
                className="p-3 bg-white rounded-xl shadow-xs border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{roomie.name}</p>
                  <p className="text-gray-400 text-xs">{roomie.email}</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" title="Active member" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Roommates;
