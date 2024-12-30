// import React, { useState, useEffect } from "react";
// import "../Styles/Tasks.css";
// import Footer from "./Footer";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCompanyData,  } from "../../store/actions/homeActions";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Loader from '../components/Loader';




// function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const apiData = useSelector((state) => state.apiData.data);
//   const userData = apiData?.me?.data || null;
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch user and coin data on component mount
//     const fetchData = async () => {
//       try {
//         await dispatch(fetchCompanyData());
//         setLoading(false); // Set loading to false after data is fetched
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false); // Set loading to false if there's an error
//       }
//     };
//     fetchData();
//   }, [dispatch]);




//   return (
// <div className="bg-black min-h-screen flex justify-center items-center font-Inter text-white">
//   <ToastContainer
//     position="top-right"
//     autoClose={500}
//     hideProgressBar={false}
//     closeOnClick
//     pauseOnHover
//     draggable
//     theme="dark"
//   />
//   {loading ? (
//     <Loader />
//   ) : (
//     <div className="w-full max-w-sm bg-black text-white rounded-lg shadow-lg overflow-hidden">
//       {/* Header Section */}
//       <div className="bg-black text-center py-4 border-b border-white">
//         <p className="text-2xl font-semibold">◥𝐔ɴɪᴛᴇᴅ々◤</p>
//       </div>

//       {/* Profile Section */}
//       <div className="px-6 py-6">
//         {/* Profile Picture */}
//         <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto">
//           {/* Display initial of the company name */}
//           {userData?.user_name
//                     ? userData.user_name
//                       .split(" ") // Split the name into words
//                       .map(word => word[0]) // Get the first letter of each word
//                       .join("") // Join the initials
//                       .toUpperCase() // Ensure uppercase
//                     : "UN"}
//         </div>

//         {/* User Info */}
//         <div className="text-center mb-6">
//           <p className="text-xl font-semibold">{userData ? userData.user_name : "User Name"}</p>
//           <p className="text-sm text-gray-400">{userData ? userData.email : "Email"}</p>
//         </div>

//         {/* Stats Section */}
//         <div className="space-y-4">
//           <div className="bg-[#1B1A1A] shadow-xl p-2 rounded-lg">
//             <div className="text-lg font-semibold">{userData ? userData.mobile : "Mobile"}</div>
//             <p className="text-sm text-gray-400">Mobile</p>
//           </div>
//           <div className="bg-[#1B1A1A] shadow-xl p-2 rounded-lg">
//             <div className="text-lg font-semibold">{userData?.company_coin ? userData.company_coin : "0"}</div>
//             <p className="text-sm text-gray-400">Company Coin</p>
//           </div>
//           <div className="bg-[#1B1A1A] shadow-xl p-2 rounded-lg relative">
//     {/* Coin Rate Display */}
//     <div className="text-lg font-semibold">
//         {userData ? `${userData.coin_rate} INR` : "N/A"}
//     </div>
//     <p className="text-sm text-gray-400">Coin Rate</p>

//     {/* Tooltip and Update Button */}
//     <div className="absolute top-0 right-0 mt-1 mr-2">
//         <div className="group relative">
//            {/* Tooltip */}
//            <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-[10px] text-white bg-black p-2 rounded">
//                   Upadate Coin Rate
//                 </div>

//             {/* Update Button */}
//             <button
//                 className="text-gray-400 hover:text-gray-200 transition"
//                 onClick={() => navigate('/profile')}
//             >
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M12 4v16m8-8H4"
//                     />
//                 </svg>
//             </button>
//         </div>
//     </div>
// </div>

//         </div>
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   )}
// </div>

  
//   );
// }

// export default Home;

import React, { useState, useEffect } from "react";
import "../Styles/Tasks.css";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyData } from "../../store/actions/homeActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios"; // Import axios to make the API call
import { BACKEND_URL } from "../../src/config";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state.apiData.data);
  const userData = apiData?.me?.data || null;
  const companyData = apiData?.data || {}; // Get company data
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null); // Track which range is being edited
  const [editedRange, setEditedRange] = useState({
    min_coins: "",
    max_coins: "",
    rate: "",
  }); // Store the edited range values

  useEffect(() => {
    // Fetch user and coin data on component mount
    const fetchData = async () => {
      try {
        await dispatch(fetchCompanyData());
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
    fetchData();
  }, [dispatch]);

  // Handle edit button click to enable editing of the range
  const handleEditClick = (index, range) => {
    // Set the index of the coin range being edited
    setEditingIndex(index);

    // Set the edited range with the current values
    setEditedRange({
      min_coins: range.min_coins,
      max_coins: range.max_coins,
      rate: range.rate,
    });
  };

  // Handle input changes for the edited range
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate input: Ensure that numeric fields are valid numbers
    if (name === "min_coins" || name === "max_coins" || name === "rate") {
      // Ensure the value is a valid number
      if (isNaN(value) || value <= 0) {
        toast.error("Value must be a valid number greater than zero.");
        return; // Don't update the state if the value is invalid
      }
    }

    // Update the state with the new input value
    setEditedRange((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (index) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      toast.error("Unauthorized! Please log in again.");
      return;
    }

    const { min_coins, max_coins, rate } = editedRange;

    const minCoins = parseFloat(min_coins);
    const maxCoins = parseFloat(max_coins);
    const newRate = parseFloat(rate);

    if (isNaN(minCoins) || isNaN(maxCoins) || isNaN(newRate)) {
      toast.error("Invalid coin range values. All fields must be numbers.");
      return;
    }

    if (minCoins <= 0 || maxCoins <= 0 || newRate <= 0) {
      toast.error("Coin values must be greater than zero.");
      return;
    }

    if (minCoins > maxCoins) {
      toast.error("Min coins cannot be greater than max coins.");
      return;
    }

    // Check if userData has coin ranges
    if (
      !Array.isArray(userData.coin_ranges) ||
      userData.coin_ranges.length === 0
    ) {
      toast.error("coin_ranges should be a non-empty array.");
      return;
    }

    const updatedRange = {
      ...userData.coin_ranges[index],
      min_coins: minCoins,
      max_coins: maxCoins,
      rate: newRate,
    };

    const rangeId = updatedRange.id; // Ensure _id exists for the coin range to be updated
    console.log("Range ID:", rangeId); // Check if rangeId is being set correctly

    if (!rangeId) {
      toast.error("The coin range ID is missing. Cannot update.");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/api-coinrate-update`,
        {
          coin_ranges: [{ ...updatedRange, id: rangeId }], // Send the ID to identify the range to update
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Coin range updated successfully!");
        const updatedCoinRanges = [...userData.coin_ranges];
        updatedCoinRanges[index] = updatedRange; // Update the local state with the new range
        dispatch(fetchCompanyData()); // Assuming fetchCompanyData reloads the updated data
        setEditingIndex(null); // Reset editing index after successful update
      } else {
        toast.error("Failed to update coin range.");
      }
    } catch (error) {
      console.error("Error updating coin range:", error);
      toast.error("Error updating coin range.");
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center font-Inter text-white">
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-sm bg-black text-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-black text-center py-4 border-b border-white">
            <p className="text-2xl font-semibold">◥𝐔ɴɪᴛᴇᴅ々◤</p>
          </div>

          {/* Profile Section */}
          <div className="px-6 py-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto">
              {userData?.user_name
                ? userData.user_name
                    .split(" ") // Split the name into words
                    .map((word) => word[0]) // Get the first letter of each word
                    .join("") // Join the initials
                    .toUpperCase() // Ensure uppercase
                : "UN"}
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <p className="text-xl font-semibold">
                {userData ? userData.user_name : "User Name"}
              </p>
              <p className="text-sm text-gray-400">
                {userData ? userData.email : "Email"}
              </p>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              {userData?.coin_ranges?.length > 0 ? (
                userData.coin_ranges.map((range, index) => (
                  <div
                    key={index}
                    className="bg-[#1B1A1A] shadow-xl p-4 rounded-lg relative"
                  >
                    {editingIndex === index ? (
                      <div>
                        {/* Editable input fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <input
                            type="number"
                            name="min_coins"
                            value={editedRange.min_coins}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded"
                            placeholder="Min Coins"
                          />
                          <input
                            type="number"
                            name="max_coins"
                            value={editedRange.max_coins}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded"
                            placeholder="Max Coins"
                          />
                          <input
                            type="number"
                            name="rate"
                            value={editedRange.rate}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded"
                            placeholder="Rate (INR)"
                          />
                        </div>
                        <button
                          onClick={() => handleSubmit(index)}
                          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-lg font-semibold">
                          {range.min_coins} - {range.max_coins} coins
                        </div>
                        <p className="text-sm text-gray-400">
                          Rate: {range.rate} INR
                        </p>

                        {/* Pencil Icon Button */}
                        <div className="absolute top-0 right-0 mt-1 mr-2">
                          <button
                            onClick={() => handleEditClick(index, range)}
                            className="text-white"
                          >
                            ✏️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div>No coin ranges found</div>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Home;

