import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { backendPath } from '../config';
import { membersAtom } from '../state/atoms/membersAtom';
import { roommateDetailsAtom } from '../state/atoms/membersName';
import { roomIdAtom } from '../state/atoms/roomIdAtom';

const Roommates = () => {
    // Get roomId from Recoil state
    const roomId = useRecoilValue(roomIdAtom);
    const setMembers = useSetRecoilState(membersAtom); // To update global membersAtom
    const setRoommateDetails = useSetRecoilState(roommateDetailsAtom); // Correct Recoil atom
    const [roommates, setRoommates] = useState([]); // Fixed naming to camelCase
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch roommates
    const getRoommates = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token found.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${backendPath}api/room`, {
                headers: {
                    Authorization: token// Ensure proper Authorization format
                }
            });

            if (response.status === 200) {
                const { members } = response.data; // Destructure members
                setRoommates(members); // Update local state
                setMembers(members); // Update Recoil state for membersAtom
                setRoommateDetails(members); // Update Recoil state for roommateDetailsAtom
                setError(null); // Clear error if successful
            }
        } catch (err) {
            setError("Failed to fetch roommates.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch roommates on component mount or when roomId changes
    useEffect(() => {
        const roomIdsend = roomId || localStorage.getItem('roomId')
        if (roomIdsend) {
            getRoommates();
        }
    }, [roomId]);

    return (
        <div className="border-t-gray-300">
            {/* Error and Loading */}
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-center">Loading roommates...</p>
            ) : (
                <>
                    <h1 className="text-xl font-semibold ml-24 mt-7 mb-5 text-[#809539]">
                        Room Mates
                    </h1>
                    <div className="w-3/5 m-auto flex flex-col gap-1">
                        {roommates.map((roomie) => (
                            <div
                                key={roomie._id}
                                className="p-2 border-b border-gray-200 bg-white"
                            >
                                {roomie.name}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Roommates;
