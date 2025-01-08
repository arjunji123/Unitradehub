// // Login.js
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../Styles/LoginDesign.css";
// import { useDispatch } from "react-redux";
// import { login } from "../../store/actions/authActions";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for the eye button
// import ToastNotification from "./Toast";
// import { logo } from "../images/index";
// import Loader from '../components/Loader';

// function Login() {
//   const dispatch = useDispatch();
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const navigate = useNavigate();


//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrors(""); // Clear previous error message
//     setLoading(true); // Set loading state to true
//     try {
//       await dispatch(login({ mobile, password })); // Dispatch login action
//       setToastMessage("Login successful!");
//       setShowToast(true);
//       navigate("/home"); // Navigate to home on success
//     } catch (error) {
//       const errorMessage = error.message || "An unknown error occurred."; // Get the error message
//       console.error("Caught error:", errorMessage); // Log error for debugging
//       setErrors(errorMessage); // Update the error state for UI display
//       setToastMessage(errorMessage); // Show the error message in toast
//       setShowToast(true);
  
//       // Stop the loading state after a short delay
//       setTimeout(() => {
//         setLoading(false); // Reset loading state to allow retry
//       }, 2000); // 2-second delay
//     }
//   };
  

//   const [firstName, setFirstName] = useState("");

//   useEffect(() => {
//     const tg = window.Telegram.WebApp;
//     const firstName = tg.initDataUnsafe?.user?.first_name;
//     setFirstName(firstName);
//   }, []);

//   return (
// <div className="bg-black flex justify-center items-center min-h-screen">
//   <ToastNotification message={toastMessage} show={showToast} setShow={setShowToast} />
//   <div className="w-full max-w-lg bg-black text-white shadow-2xl rounded-2xl overflow-hidden font-Inter">
//     {/* Header Section */}
//     <div className="p-6 sm:p-10 shadow-lg">
//       {/* Header content (optional) */}
//     </div>

//     {/* Form Section */}
//     <div className="p-6 sm:p-8 space-y-6">
//       <h2 className="text-2xl font-semibold text-center text-white mb-6">
//         Log in to your account
//       </h2>

//       <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 px-2 sm:px-4">
//         <div className="relative">
//           <label className="absolute -top-2 left-3 text-xs text-gray-400 bg-black px-1">Mobile No</label>
//           <input
//             type="number"
//             name="mobile"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//             required
//             className="w-full px-4 py-3 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 text-sm"
//             placeholder="Mobile Number"
//             autoComplete="mobile"
//           />
//         </div>

//         <div className="relative">
//           <label className="absolute -top-2 left-3 text-xs text-gray-400 bg-black px-1">Password</label>
//           <input
//             type={showPassword ? "text" : "password"} // Toggle input type
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-3 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 text-sm"
//             placeholder="Password"
//             autoComplete="current-password"
//           />

//           {/* Toggle Button */}
//           <button
//             type="button"
//             onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
//             className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-[#00c6ff] transition duration-300"
//           >
//             {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//           </button>
//         </div>

//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className={`w-full py-3 bg-[#6339F9] text-white font-bold rounded-full hover:bg-blue-700 transition ${
//               loading ? "cursor-not-allowed opacity-70" : "hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
//             }`}
//             disabled={loading}
//           >
//             {loading ? (
//               <div className="flex justify-center items-center">
//                 <div className="spinner"></div> {/* Custom spinner */}
//               </div>
//             ) : (
//               "Log In" // Normal button text
//             )}
//           </button>
//         </div>
//       </form>

//       <div className="text-center">
//         <Link
//           to="/forgot"
//           className="text-xs sm:text-sm text-[#b0b0b0] hover:text-white transition-all"
//         >
//           Forgot Password?
//         </Link>
//       </div>
//     </div>

//     {/* CSS for Custom Spinner */}
//     <style jsx>{`
//       .spinner {
//         border: 4px solid #f3f3f3; /* Light background */
//         border-top: 4px solid #000000; /* Black color */
//         border-radius: 50%;
//         width: 24px;
//         height: 24px;
//         animation: spin 1s linear infinite;
//       }

//       @keyframes spin {
//         0% {
//           transform: rotate(0deg);
//         }
//         100% {
//           transform: rotate(360deg);
//         }
//       }
//     `}</style>

//     {/* Footer Section */}
//     <div className="bg-[#111113] py-4 sm:py-6 text-center rounded-b-2xl">
//       <p className="text-xs sm:text-sm text-[#909090]">
//         New to Unitrade?
//         <Link to="/" className="text-white font-semibold hover:underline ml-1">
//           Sign Up
//         </Link>
//       </p>
//     </div>
//   </div>
// </div>

//   );
// }

// export default Login;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/LoginDesign.css";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/authActions";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for the eye button
import ToastNotification from "./Toast";
import { logo } from "../images/index";
import Loader from '../components/Loader';
import axios from "axios"; // For API calls;
import Swal from "sweetalert2"; // SweetAlert2 for alerts
import { BACKEND_URL } from '../../src/config';

function Login() {
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors(""); // Clear previous error message
    setLoading(true); // Show loading spinner
  
    let loginSuccessful = false;
  
    try {
      // Step 1: Attempt to log in
      await dispatch(login({ mobile, password })); // Dispatch login action
      setToastMessage("Login successful!");
      setShowToast(true);
      loginSuccessful = true; // Mark login as successful
    } catch (error) {
      // Handle login error
      const errorMessage = error.response?.data?.message || "Login failed. Proceeding to check payment status.";
      console.error("Login error:", errorMessage);
      setErrors(errorMessage);
      setToastMessage(errorMessage);
      setShowToast(true);
    }

    try {
      // Step 2: Call `check-pay` API regardless of login success
      const response = await axios.post(  `${BACKEND_URL}/api/v1/check-pay`, { mobile });
      const { success, message, user } = response.data;
      const userId = response.data.user.id;
      console.log("userId:", userId);
      if (success) {
        if (user.status === "1" && loginSuccessful) {
          // User is activated and login was successful, navigate to home
          navigate("/home");
        } else if (user.status === "0") {
          // User hasn't paid, show SweetAlert for payment
          Swal.fire({
            icon: "warning",
            title: "Payment Required",
            text: "You haven't completed your payment. Please proceed to the payment screen.",
            confirmButtonText: "Go to Payment",
            background: "#333", // Dark mode
            color: "#fff",
            iconColor: "#f39c12", // Dark-themed warning color
          }).then(() => {
            // Redirect to the payment screen
            navigate(`/payment/${userId}`);
          });
        } else {
          // User has already paid but admin activation is pending
          Swal.fire({
            icon: "info",
            title: "Pending Activation",
            text: "You have completed the payment. Please wait for admin activation.",
            confirmButtonText: "OK",
            background: "#333", // Dark mode
            color: "#fff",
            iconColor: "#3498db", // Dark-themed info color
          });
        }
      } else {
        console.error("Check-pay API failed:", message);
      }
    } catch (error) {
      // Handle errors from `check-pay` API
      const errorMessage = error.response?.data?.message || "Error occurred while checking payment status.";
      console.error("Check-pay API error:", errorMessage);
      setErrors(errorMessage);
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  
  

  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const firstName = tg.initDataUnsafe?.user?.first_name;
    setFirstName(firstName);

    // Use Telegram API to disable closing confirmation
    tg.disableClosingConfirmation();

    // Block drag and touch gestures globally
    const preventDrag = (e) => e.preventDefault();
    const preventTouch = (e) => e.preventDefault();

    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("touchmove", preventTouch);
    };
  }, []);
  const handleNavigate = () => {
    navigate('/');
  };
  return (
    <div className="bg-black flex justify-center items-center min-h-screen">
      <ToastNotification message={toastMessage} show={showToast} setShow={setShowToast} />
      <div className="w-full max-w-lg bg-black text-white shadow-2xl rounded-2xl overflow-hidden font-Inter">
        {/* Header Section */}
        <div className="p-6 sm:p-10 shadow-lg">
          {/* Header content (optional) */}
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-white mb-6">
            Log in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 px-2 sm:px-4">
            <div className="relative">
              <label className="absolute -top-2 left-3 text-xs text-gray-400 bg-black px-1">Mobile No</label>
              <input
                type="number"
                name="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 text-sm"
                placeholder="Mobile Number"
                autoComplete="mobile"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 text-xs text-gray-400 bg-black px-1">Password</label>
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 text-sm"
                placeholder="Password"
                autoComplete="current-password"
              />

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-[#00c6ff] transition duration-300"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full py-3 bg-[#6339F9] text-white font-bold rounded-full hover:bg-blue-700 transition ${
                  loading ? "cursor-not-allowed opacity-70" : "hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="spinner"></div> {/* Custom spinner */}
                  </div>
                ) : (
                  "Log In" // Normal button text
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              to="/forgot"
              className="text-xs sm:text-sm text-[#b0b0b0] hover:text-white transition-all"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* CSS for Custom Spinner */}
        <style jsx>{`
          .spinner {
            border: 4px solid #f3f3f3; /* Light background */
            border-top: 4px solid #000000; /* Black color */
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>

        {/* Footer Section */}
        <div className="bg-[#111113] py-4 sm:py-6 text-center rounded-b-2xl">
          <p   onClick={handleNavigate} className="text-xs sm:text-sm text-[#909090]">
            New to Unitrade?
            <Link to="/" className="text-white font-semibold hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


