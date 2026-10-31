import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { roomIdAtom } from '../state/atoms/roomIdAtom';
import { invitationApi } from '../api/roomieApi';
import Skeleton from './Skeleton';

const Invitation = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setRoomId = useSetRecoilState(roomIdAtom);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invitationApi.getPendingInvitations();
      // data can be array directly or { invites: [...] }
      const list = Array.isArray(data) ? data : data?.invites || [];
      setInvitations(list);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError('Error fetching invitations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const acceptInvite = async (inviteId, senderName) => {
    try {
      const data = await invitationApi.acceptInvitation(inviteId);
      // data can be RoomResponse { id, name, ... } or { room: { id, ... } }
      const newRoom = data?.room || data;
      const acceptedRoomId = newRoom?.id || newRoom?._id || data?.roomId;

      alert(`Accepted invitation from ${senderName || 'roommate'}!`);
      setInvitations((prev) => prev.filter((inv) => (inv.id || inv._id) !== inviteId));

      if (acceptedRoomId) {
        setRoomId(acceptedRoomId);
        localStorage.setItem('roomId', acceptedRoomId);
        localStorage.setItem('currentRoomId', acceptedRoomId);
      }

      navigate('/home');
    } catch (err) {
      console.error('Error accepting invitation:', err);
      alert(err?.message || 'Failed to accept the invitation.');
    }
  };

  const rejectInvite = async (inviteId) => {
    try {
      await invitationApi.rejectInvitation(inviteId);
      setInvitations((prev) => prev.filter((inv) => (inv.id || inv._id) !== inviteId));
      alert('Invitation rejected.');
    } catch (err) {
      console.error('Error rejecting invitation:', err);
      alert(err?.message || 'Failed to reject invitation.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full min-h-screen p-6">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">Pending Invitations</h2>
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 overflow-auto">
          <Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl text-gray-800">Pending Invitations</h2>
        <button
          onClick={fetchInvitations}
          className="text-xs text-blue-600 hover:underline cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {error && <div className="text-red-500 text-xs mb-3">{error}</div>}

      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-auto divide-y divide-gray-100 shadow-sm">
        {invitations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <span className="text-3xl block mb-2">✉️</span>
            No pending invitations found.
          </div>
        ) : (
          invitations.map((inv) => {
            const inviteId = inv.id || inv._id;
            const roomIdVal =
              inv.roomId?.id ||
              inv.roomId?._id ||
              (typeof inv.roomId === 'string' ? inv.roomId : null);
            const senderName =
              inv.sender?.name || inv.senderId?.name || inv.Admin || 'Roommate';
            const roomName = inv.roomName || 'Shared Apartment';
            const roommatesCount = inv.roommatesCount || inv.roommates || 1;

            return (
              <div
                key={inviteId}
                className="flex flex-col sm:flex-row justify-between sm:items-center p-4 hover:bg-gray-50 transition-colors gap-3"
              >
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 text-base">{roomName}</div>
                  <div className="text-gray-600 text-xs mt-0.5">
                    <strong>Invited by:</strong> {senderName}
                  </div>
                  <div className="text-gray-500 text-xs">
                    <strong>Current Members:</strong> {roommatesCount}
                  </div>
                  {roomIdVal && (
                    <div className="text-gray-400 text-[10px] font-mono mt-1">
                      Room ID: {roomIdVal}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-xs"
                    onClick={() => acceptInvite(inviteId, senderName)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    onClick={() => rejectInvite(inviteId)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Invitation;
