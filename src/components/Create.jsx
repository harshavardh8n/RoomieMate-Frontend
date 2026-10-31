import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state/atoms/userAtom";
import { roomIdAtom } from "../state/atoms/roomIdAtom";
import { useNavigate } from "react-router-dom";
import { userApi, roomApi } from "../api/roomieApi";
import Loader from "./Loader";

const Create = () => {
  const [totalPeople, setTotalPeople] = useState([]);
  const [invitedPeople, setInvitedPeople] = useState([]);
  const [roomName, setRoomName] = useState("My Room");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const user = useRecoilValue(userState);
  const setRoomId = useSetRecoilState(roomIdAtom);

  useEffect(() => {
    const fetchIdlePeople = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userApi.getIdleUsers();
        // data can be array directly or { idlePeople: [...] }
        const list = Array.isArray(data) ? data : data?.idlePeople || [];
        setTotalPeople(list);
      } catch (err) {
        console.error("Error fetching idle people:", err);
        setError("Failed to load idle people.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdlePeople();
  }, []);

  const handleCreate = async () => {
    if (!roomName.trim()) {
      setError("Please provide a room name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const invitedIds = invitedPeople.map((person) => person.id || person._id);
      const data = await roomApi.createRoom(roomName.trim(), invitedIds);
      // data = RoomResponse { id, name, members, ... }
      const newRoomId = data?.id || data?._id || data?.roomId;

      alert("Room created successfully!");
      setInvitedPeople([]);

      if (newRoomId) {
        localStorage.setItem("roomId", newRoomId);
        localStorage.setItem("currentRoomId", newRoomId);
        setRoomId(newRoomId);
      }

      navigate("/home");
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err?.message || "Failed to create the room.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPeople = totalPeople.filter((person) =>
    (person.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (person.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (person) => {
    const pId = person.id || person._id;
    setInvitedPeople((prev) => [...prev, person]);
    setTotalPeople((prev) => prev.filter((p) => (p.id || p._id) !== pId));
  };

  const handleRemove = (person) => {
    const pId = person.id || person._id;
    setTotalPeople((prev) => [...prev, person]);
    setInvitedPeople((prev) => prev.filter((p) => (p.id || p._id) !== pId));
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-100">
      <div className="flex-grow max-w-xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#809539]">Create a Room</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Room Name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#809539]"
              placeholder="e.g. Apartment 402, Oakwood Suite"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Invite Roommates
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#809539]"
              placeholder="Search user by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {loading ? (
              <div className="h-44 overflow-auto mt-2 border border-gray-200 bg-white rounded-lg flex items-center justify-center">
                <Loader text="Loading Idle People..." />
              </div>
            ) : (
              <div className="h-44 overflow-auto mt-2 border border-gray-200 bg-white rounded-lg divide-y divide-gray-100">
                {filteredPeople.length === 0 ? (
                  <p className="p-4 text-xs text-gray-400 text-center">
                    No idle users found.
                  </p>
                ) : (
                  filteredPeople.map((person) => {
                    const pId = person.id || person._id;
                    return (
                      <div
                        key={pId}
                        className="p-2.5 hover:bg-gray-50 flex justify-between items-center transition-colors"
                      >
                        <div className="text-xs">
                          <p className="font-semibold text-gray-800">{person.name}</p>
                          <p className="text-gray-500">{person.email}</p>
                        </div>
                        <button
                          type="button"
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md px-3 py-1 cursor-pointer transition-colors"
                          onClick={() => handleInvite(person)}
                        >
                          Invite
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase text-gray-600 mb-1">
              Invited People ({invitedPeople.length})
            </h3>
            <div className="h-40 overflow-auto border border-gray-200 bg-white rounded-lg divide-y divide-gray-100">
              {invitedPeople.length === 0 ? (
                <p className="p-4 text-xs text-gray-400 text-center">
                  No roommates invited yet. You can invite idle users above.
                </p>
              ) : (
                invitedPeople.map((person) => {
                  const pId = person.id || person._id;
                  return (
                    <div
                      key={pId}
                      className="p-2.5 hover:bg-gray-50 flex justify-between items-center transition-colors"
                    >
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">{person.name}</p>
                        <p className="text-gray-500">{person.email}</p>
                      </div>
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md px-3 py-1 cursor-pointer transition-colors"
                        onClick={() => handleRemove(person)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <button
          className="w-full mt-6 py-3 bg-[#809539] hover:bg-[#6e8030] text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          onClick={handleCreate}
          disabled={submitting}
        >
          {submitting ? "Creating Room..." : "Create Room"}
        </button>
      </div>
    </div>
  );
};

export default Create;
