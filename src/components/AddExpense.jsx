import React, { useState, useEffect,Suspense } from "react";
import axios from "axios";
import { backendPath } from "../config"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

const SplitterLayout = ({ roommates, onRoommateClick }) => {
    // Display message if no roommates are available
    if (!roommates.length) {
      return <div className="text-center text-gray-500">No roommates available to display.</div>;
    }
  
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        {roommates.map((roommate) => (
          <div
            key={roommate._id}
            className="p-2 border rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => onRoommateClick(roommate)} // Use onRoommateClick from props
          >
            {roommate.name}
          </div>
        ))}
      </div>
    );
  };
  

  
  const AddExpense = () => {
      const [roommates, setRoommates] = useState([]); // List of roommates
      const [loading, setLoading] = useState(true); // Loading state
      const [error, setError] = useState(null); // Error state
      const [selectedRoommates, setSelectedRoommates] = useState([]); // List of selected roommates
      const [amount, setAmount] = useState(0); // Expense amount
      const [description, setDescription] = useState(""); // Expense description
      const [expenseAdded, setExpenseAdded] = useState(false); // State to track expense addition
      const navigate = useNavigate();
  
      // Fetch roommates data when the component mounts or when expense is added
      useEffect(() => {
          const fetchRoommates = async () => {
              try {
                  const token = localStorage.getItem("token");
                  const roomId = localStorage.getItem("roomId");
  
                  if (!token || !roomId) {
                      setError("Token or Room ID is missing.");
                      setLoading(false);
                      return;
                  }
  
                  const response = await axios.get(`${backendPath}api/room`, {
                      headers: {
                          Authorization: token,
                      },
                  });
  
                  if (response.status === 200) {
                      setRoommates(response.data.members);
                  }
              } catch (err) {
                  setError("Failed to fetch roommates.");
              } finally {
                  setLoading(false);
              }
          };
  
          fetchRoommates();
      }, [expenseAdded]); // Refetch roommates when expense is added
  
      const handleSelection = async () => {
          if (!amount || !description || selectedRoommates.length === 0) {
              setError("Please provide an amount, description, and select roommates.");
              return;
          }
  
          const token = localStorage.getItem("token");
          const roomId = localStorage.getItem("roomId");
  
          if (!token) {
              setError("Authorization token is missing.");
              return;
          }
  
          try {
              // Prepare the data to be sent in the API request
              const expenseData = {
                  amount: amount,
                  roomId: roomId,
                  expenseDesc: description,
                  splittersIds: selectedRoommates.map(roommate => roommate._id),
              };
  
              // API call to add the expense
              const response = await axios.post(
                  `${backendPath}expenses/add`,
                  expenseData,
                  {
                      headers: {
                          Authorization: token,
                      },
                  }
              );

              console.log(response)
  
              if (response.status === 201) {
                  alert("Expense added successfully!");
                  setAmount(""); // Reset the form fields
                  setDescription("");
                  setSelectedRoommates([]); // Clear selected roommates
  
                  // Set expenseAdded to trigger re-render and show the new components
                  navigate("/home");
              } else {
                  setError("Failed to add expense.");
              }
          } catch (error) {
              setError("Error adding expense.");
          }
      };
  
      const handleRoommateClick = (roommate) => {
          if (selectedRoommates.includes(roommate)) {
              // Deselect roommate if already selected
              setSelectedRoommates(selectedRoommates.filter(r => r._id !== roommate._id));
              setRoommates(prevRoommates => [...prevRoommates, roommate]);
          } else {
              // Add roommate to selected
              setSelectedRoommates([...selectedRoommates, roommate]);
              setRoommates(prevRoommates => prevRoommates.filter(r => r._id !== roommate._id));
          }
      };
  
      if (loading) {
          return <p>Loading roommates...</p>;
      }
  
      if (error) {
          return <p className="text-red-500">{error}</p>;
      }
  
      return (
          <div className="flex justify-center items-center h-screen">
              <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
                  <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">Add an Expense</h1>
  
                  <div className="space-y-4">
                      {/* Input field for amount */}
                      <div>
                          <label className="block text-gray-600">Amount</label>
                          <input
                              type="number"
                              className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                          />
                      </div>
  
                      {/* Input field for description */}
                      <div>
                          <label className="block text-gray-600">Description</label>
                          <input
                              type="text"
                              className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Description of the expense"
                          />
                      </div>
  
                      {/* Splitters */}
                      <div>
                          <label className="block text-gray-600">Select Splitters</label>
                          <SplitterLayout roommates={roommates} onRoommateClick={handleRoommateClick} />
                      </div>
  
                      {/* Error Message */}
                      {error && <p className="text-red-500 text-sm">{error}</p>}
  
                      {/* Submit Button */}
                      <div>
                          <button
                              onClick={handleSelection}
                              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                              Add Expense
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };
  
  export default AddExpense;
