import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../state/atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { backendPath } from "../config";
import Loader from "./Loader";

const Create = () => {
  const [totalPeople, setTotalPeople] = useState([]);
  const [invitedPeople, setInvitedPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchIdlePeople = async () => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendPath}api/idlePeople`, {
          headers: {
            Authorization: token,
          },
        });
        setTotalPeople(response.data.idlePeople); // Assuming `idlePeople` is an array of objects
      } catch (err) {
        console.error("Error fetching idle people:", err.message);
        setError("Failed to load idle people.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchIdlePeople();
  }, []);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        `${backendPath}api/rooms`,
        {
          members: invitedPeople.map((person) => person._id)
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        alert("Room created successfully!");
        setInvitedPeople([]);
        localStorage.setItem('roomId', response.data.roomId);
        navigate("/home");
      }
    } catch (err) {
      console.error("Error creating room:", err.message);
      setError(err.response?.data?.message || "Failed to create the room.");
    }
  };

  const filteredPeople = totalPeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (person) => {
    setInvitedPeople((prev) => [...prev, person]);
    setTotalPeople((prev) => prev.filter((p) => p._id !== person._id));
  };

  const handleRemove = (person) => {
    setTotalPeople((prev) => [...prev, person]);
    setInvitedPeople((prev) => prev.filter((p) => p._id !== person._id));
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100">
      <div className="flex-grow">
        <h2 className="text-xl font-semibold mb-4">Create a Room</h2>
        <div>
          <input
            type="text"
            className="h-7 border border-gray-300 rounded-lg px-2 py-5 w-full"
            placeholder="Search user by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading ? (
            
            <div className="h-44 overflow-auto mt-4 border-2 border-gray-300 bg-white rounded-lg">
              <div className="w-1/2 m-auto h-1/2 mt-4" >
              <Loader text="Loading Idle People"/>
              </div>
              
            </div>
             
          ) : (
            <div className="h-44 overflow-auto mt-4 border-2 border-gray-300 bg-white rounded-lg">
              {filteredPeople.map((person) => (
                <div
                  key={person._id}
                  className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-3/4">
                      <strong>Name:</strong> {person.name} <br />
                      <strong>Email:</strong> {person.email}
                    </div>
                    <button
                      className="bg-green-400 rounded-md p-1.5"
                      onClick={() => handleInvite(person)}
                    >
                      Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <h2 className="font-semibold">Invited People</h2>
            <div className="h-44 overflow-auto mt-2 border-2 border-gray-300 bg-white rounded-lg">
              {invitedPeople.map((person) => (
                <div
                  key={person._id}
                  className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-3/4">
                      <strong>Name:</strong> {person.name} <br />
                      <strong>Email:</strong> {person.email}
                    </div>
                    <button
                      className="bg-red-600 rounded-md p-1.5 text-white"
                      onClick={() => handleRemove(person)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        className="w-full lg:w-1/4 p-2 bg-amber-400 rounded-lg mx-auto"
        onClick={handleCreate}
      >
        Create Room
      </button>
    </div>
  );
};

export default Create;
