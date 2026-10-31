import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { expenseApi, roomApi } from "../api/roomieApi";

const CATEGORIES = ['FOOD', 'GROCERIES', 'RENT', 'UTILITIES', 'ENTERTAINMENT', 'SHOPPING', 'OTHER'];

const SplitterLayout = ({ roommates, selectedRoommates, onToggleRoommate }) => {
  if (!roommates || roommates.length === 0) {
    return <div className="text-center text-gray-400 text-xs py-2">No roommates available.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 mt-2 max-h-36 overflow-y-auto p-1">
      {roommates.map((roommate) => {
        const rId = roommate.id || roommate._id;
        const isSelected = selectedRoommates.some((r) => (r.id || r._id) === rId);

        return (
          <button
            type="button"
            key={rId}
            className={`p-2 border rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              isSelected
                ? 'bg-[#809539] text-white border-[#809539]'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => onToggleRoommate(roommate)}
          >
            {isSelected ? '✓ ' : '+ '} {roommate.name}
          </button>
        );
      })}
    </div>
  );
};

const AddExpense = ({ onExpenseAdded }) => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoommates, setSelectedRoommates] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FOOD");
  const navigate = useNavigate();

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      setError(null);
      const roomId = localStorage.getItem("roomId") || localStorage.getItem("currentRoomId");

      if (roomId) {
        try {
          const room = await roomApi.getRoomDetails(roomId);
          if (room && room.members) {
            setRoommates(room.members);
            setSelectedRoommates(room.members); // Default: split with everyone
            setLoading(false);
            return;
          }
        } catch (detailErr) {
          console.warn('Falling back to getUserRooms()', detailErr);
        }
      }

      const rooms = await roomApi.getUserRooms();
      const roomList = Array.isArray(rooms) ? rooms : rooms?.rooms || [];
      if (roomList.length > 0) {
        const primaryRoom = roomList[0];
        const primaryId = primaryRoom.id || primaryRoom._id;
        if (primaryId) {
          localStorage.setItem("roomId", primaryId);
          localStorage.setItem("currentRoomId", primaryId);
        }
        const members = primaryRoom.members || [];
        setRoommates(members);
        setSelectedRoommates(members);
      } else {
        setRoommates([]);
      }
    } catch (err) {
      console.error("Failed to fetch roommates:", err);
      setError("Failed to fetch roommates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, []);

  const handleToggleRoommate = (roommate) => {
    const rId = roommate.id || roommate._id;
    if (selectedRoommates.some((r) => (r.id || r._id) === rId)) {
      if (selectedRoommates.length === 1) {
        setError("At least one person must be selected to split.");
        return;
      }
      setSelectedRoommates(selectedRoommates.filter((r) => (r.id || r._id) !== rId));
    } else {
      setSelectedRoommates([...selectedRoommates, roommate]);
    }
  };

  const handleSelectAll = () => {
    setSelectedRoommates(roommates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please provide a valid amount greater than 0.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide an expense description.");
      return;
    }
    if (selectedRoommates.length === 0) {
      setError("Please select at least one roommate to split with.");
      return;
    }

    const roomId = localStorage.getItem("roomId") || localStorage.getItem("currentRoomId");
    if (!roomId) {
      setError("Room ID not found. Please select or create a room.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const splittersIds = selectedRoommates.map((r) => r.id || r._id);

      await expenseApi.createExpense(roomId, {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        splittersIds,
      });

      alert("Expense added and balances updated!");
      setAmount("");
      setDescription("");
      setCategory("FOOD");
      setSelectedRoommates(roommates);

      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err?.message || "Failed to add expense.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-sm">Loading roommates...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>➕</span> Add New Expense
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Description
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#809539]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. WiFi Bill, Dinner at Olive Garden"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#809539]"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#809539]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold uppercase text-gray-500">
              Split with ({selectedRoommates.length}/{roommates.length})
            </label>
            {selectedRoommates.length < roommates.length && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] text-blue-600 hover:underline cursor-pointer"
              >
                Select All
              </button>
            )}
          </div>
          <SplitterLayout
            roommates={roommates}
            selectedRoommates={selectedRoommates}
            onToggleRoommate={handleToggleRoommate}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-[#809539] hover:bg-[#6c7f30] text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Splitting Expense..." : "Split Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
