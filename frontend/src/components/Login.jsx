// Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/LoginDesign.css";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/authActions";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for the eye button
import ToastNotification from "./Toast";
import { logo } from "../images/index";
import Loader from '../components/Loader';

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
    setLoading(true); // Set loading state to true
    try {
      await dispatch(login({ mobile, password })); // Dispatch login action
      setToastMessage("Login successful!");
      setShowToast(true);
      navigate("/home"); // Navigate to home on success
    } catch (error) {
      const errorMessage = error.message || "An unknown error occurred."; // Get the error message
      console.error("Caught error:", errorMessage); // Log error for debugging
      setErrors(errorMessage); // Update the error state for UI display
      setToastMessage(errorMessage); // Show the error message in toast
      setShowToast(true);
  
      // Stop the loading state after a short delay
      setTimeout(() => {
        setLoading(false); // Reset loading state to allow retry
      }, 2000); // 2-second delay
    }
  };
  

  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const firstName = tg.initDataUnsafe?.user?.first_name;
    setFirstName(firstName);
  }, []);

  return (
    <div className="bg-black flex justify-center items-center min-h-screen overflow-hidden ">
      <ToastNotification message={toastMessage} show={showToast} setShow={setShowToast} />
      <div className="w-full max-w-lg bg-black text-white h-screen shadow-2xl overflow-hidden  font-Inter ">
        <div className="p-6 sm:p-10  shadow-lg relative ">
          <div className="absolute top-0 left-0 w-full h-1 "></div>
          {/* <div className="flex justify-center py-4 space-x-1">
            <h1 className="font-poppins text-xl sm:text-2xl font-extrabold">
              UNITRADE
            </h1>
            <img
              src={logo}
              alt="logo"
              className="w-5 sm:w-6 h-5 sm:h-6 mt-0.5"
            />
          </div> */}
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8 space-y-6 ">
          <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Log in to your account
          </h2>

          <form onSubmit={handleLogin}
            className="space-y-4 sm:space-y-6 px-2 sm:px-4" >
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        {/* Footer Section */}
        <div className="bg-[#111113] py-4 sm:py-6 text-center rounded-b-2xl">
          <p className="text-xs sm:text-sm text-[#909090]">
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
