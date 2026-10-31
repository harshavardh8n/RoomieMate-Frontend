import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { roomIdAtom } from '../state/atoms/roomIdAtom';
import { backendPath } from '../config';
import Loader from './Loader';
import Skeleton from './Skeleton';

const Invitation = () => {
  const [invitations, setInvitations] = useState([]);  // Start with an empty array
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // For error handling
  const navigate = useNavigate();
  const [roomid, setRoomId] = useRecoilState(roomIdAtom);

  // Fetch invitations when the component is mounted
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const token = localStorage.getItem('token');  // Assuming token is stored in localStorage

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        // Send the GET request with the Authorization header
        const response = await axios.get(`${backendPath}api/getInvites`, {
          headers: {
            'Authorization': token  // Pass the token in the Authorization header
          }
        });

        if (response.data.success) {
          setInvitations(response.data.invites);  // Set the fetched invitations to state
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching invitations.');
        console.error('Error fetching invitations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();  // Call the function to fetch invitations
  }, []);  // Empty dependency array to run only once when the component is mounted

  const acceptInvite = async (inviteId,name) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      // Log the token to ensure it's correct
      console.log('Token:', token);
      alert(name)
      // Make API request to accept the invitation
      const response = await axios.post(`${backendPath}api/acceptInvitations`, {
        invitationId: inviteId,
      }, {
        headers: {
          Authorization:token
        }
      });

      // Log the response to check if it's successful
      console.log('Response:', response.data);

      // If the invitation is accepted, remove it from the list and update state
      if (response.data.success) {
        setInvitations(invitations.filter(invite => invite._id !== inviteId));
        setRoomId(response.data.room._id);
        localStorage.setItem('roomId', response.data.room._id);
        alert('Invitation accepted successfully!');
        navigate("/home");
      } else {
        setError(response.data.message || 'Failed to accept the invitation.');
      }
    } catch (error) {
      // Catch errors and log them
      setError('Error accepting invitation.');
      console.error('Error accepting invitation:', error.response || error.message);
    }
  };

  if (loading) {
    return <div className="flex flex-col h-screen">
    <div>
      <h2 className="m-4 font-semibold text-xl">Invitations</h2>
    </div>
    <div className="flex-1 mx-4 bg-white border border-gray-300 rounded-lg overflow-auto">
    <div className="flex justify-between items-center p-4 border-b border-gray-200 m-auto">
            <Skeleton/>  
    </div>
    </div>
    <div className="m-auto p-2 rounded-lg bg-yellow-400 mt-8">
      <button>Find rooms in your area</button>
    </div>
  </div>;  // Show loading state
  }

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h2 className="m-4 font-semibold text-xl">Invitations</h2>
      </div>
      <div className="flex-1 mx-4 bg-white border border-gray-300 rounded-lg overflow-auto">
        {/* {error && <div className="text-red-600 p-4 text-center">{error}</div>} Show error if any */}
        
        {invitations.length === 0 ? (
          <div className="p-4 text-center text-gray-600">No invitations found</div>
        ) : (
          invitations.map((inv) => (
            <div key={inv._id} className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="w-3/4">
                <div className="font-semibold">Room ID: {inv.roomId._id}</div>
                <div className="text-gray-600">Sender: {inv.senderId.name}</div> {/* Assuming senderId is the admin */}
                <div className="text-gray-600">Roommates: {inv.roommates}</div> {/* Number of roommates */}
              </div>
              <div className="flex justify-center">
                <button 
                  className="p-2 bg-green-500 rounded-lg w-20"
                  onClick={() => acceptInvite(inv._id,inv.senderId.name)}  // Fix for onClick handler
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="m-auto p-2 rounded-lg bg-yellow-400 mt-8">
        <button>Find rooms in your area</button>
      </div>
    </div>
  );
};

export default Invitation;
