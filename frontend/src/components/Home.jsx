import React, { useState, useEffect } from "react";
import "../Styles/Tasks.css";
import Logo from "../utils/Logo";
import Footer from "./Footer";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeData, fetchCoinData, transferCoins } from "../../store/actions/homeActions";
import { IoMenu, IoLogOutOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from '../components/Loader';
import { logout } from "../../store/actions/authActions"



function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state.apiData.data);
  const userData = apiData?.me?.data || null;
  const pendingCoin = apiData?.coin?.data || null;
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  // State to manage whether the menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNavigate = () => {
    navigate('/Profile');
  };
  // Toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    // Fetch user and coin data on component mount
    const fetchData = async () => {
      try {
        await dispatch(fetchCoinData());
        await dispatch(fetchMeData());
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
    fetchData();
  }, [dispatch]);

  const handleClick = () => {
    if (pendingCoin?.pending_coin === 0) {
      toast.warn("You have no coins.");
      return;
    }

    // Trigger animation effect and sound/vibration
    setIsAnimating(true);

    // Play sound for 0.5 seconds
    const vibrationSound = new Audio('src/assets/sound/mobile-phone-vibration-77849.mp3');
    vibrationSound.play();
    vibrationSound.currentTime = 0; // Reset to start
    setTimeout(() => vibrationSound.pause(), 500); // Stop sound after 0.5s

    // Trigger phone vibration (vibrate for 500ms)
    if (navigator.vibrate) {
      navigator.vibrate(500); // Vibrate for 500ms
    }

    // Dispatch coin transfer action
    dispatch(transferCoins())
      .then(() => {
        // Animate coins on successful transfer
        const newCoins = Array.from({ length: 10 }, (_, i) => ({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 500,
          y: (Math.random() - 0.5) * 500,
          rotate: Math.random() * 360,
        }));
        setCoins(newCoins);

        // Remove coins after animation
        setTimeout(() => setCoins([]), 1000);

        // Re-fetch data to update userData and pendingCoin without hard refresh
        dispatch(fetchCoinData());
        dispatch(fetchMeData());
      })
      .catch((error) => {
        // Show error message if transfer fails
        toast.error("Coin transfer failed.");
      })
      .finally(() => {
        // Reset animation after it's completed
        setTimeout(() => setIsAnimating(false), 1000); // Duration of the animation
      });
  };
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="bg-black flex justify-center items-center font-Inter min-h-screen w-full overflow-hidden relative">
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
        <div className="w-full bg-black text-white min-h-screen overflow-y-scroll flex flex-col max-w-lg relative">
          {/* Header Section */}
          <div className="flex justify-between items-center p-4">
            <div className="relative">
              {/* Menu Icon Button */}
              <button onClick={toggleMenu} className="h-6 w-6 text-gray-400">
                <IoMenu size={22} />
              </button>

              {/* Dropdown Menu - Shows when isMenuOpen is true */}
              {isMenuOpen && (
                <div className=" fixed left-0  mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
                  <ul className="space-y-2 p-2">
                    {/* Logout Button */}
                    <li>
                      <button
                        onClick={handleLogout} // This function will handle the logout action
                        className="flex items-center w-full text-left p-2 hover:bg-gray-700 rounded-md"
                      >
                        <IoLogOutOutline size={20} className="mr-2" /> {/* Logout icon */}
                        <span className="text-sm">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <AiOutlineQuestionCircle size={24} className=" text-gray-400" />
              <CgProfile onClick={handleNavigate} size={24} className=" text-gray-400" />
            </div>
          </div>
          <div style={{
            position: 'absolute',
            width: '239px',
            height: '239px',
            left: '160px',
            top: '116px',
            background: 'rgba(99, 57, 249, 0.25',
            filter: 'blur(100px)',
          }}>
            <img src="src/assets/images/Ellipse 9.png" alt="" style={{ width: '100%', height: '100%' }} />
          </div>
          {/* User Info Section */}
          <div className="flex flex-col items-center  space-y-2">
            <div
              onClick={handleNavigate}
              className="bg-blue-600 text-white h-28 w-28 flex justify-center items-center rounded-full"
            >
              {userData?.user_photo ? (
                <img
                  src={userData.user_photo}
                  alt="Profile"
                  className="w-20 h-20 object-cover rounded-full border-4 border-gray-600"
                />
              ) : (
                <span className="text-4xl ">
                  {userData?.user_name
                    ? userData.user_name
                      .split(" ")
                      .map(word => word[0])
                      .join("")
                      .toUpperCase()
                    : "UN"}
                </span>
              )}
            </div>

            <p className="text-xl  uppercase font-Inter">
              {userData ? userData.user_name : "User Name"}
            </p>
            {/* <p className="text-5xl font-semibold flex">
              <span>
                <img src="src/assets/logo/U.png" alt="" className="w-11 h-11 mt-1" />
              </span>
              <span>{userData ? userData.coins : "0"}</span>
            </p> */}
          </div>
          <div style={{
            position: 'absolute',
            width: '243px',
            height: '243px',
            left: '-91px',
            top: '423px',
            background: 'rgba(99, 57, 249, 0.25)',
            filter: 'blur(100px)',
          }}>
            <img src="src/assets/images/Ellipse 8.png" alt="" style={{ width: '100%', height: '100%' }} />
          </div>
          {/* Wallet Section */}
          <div className="mt-auto px-3 py-4 mb-10">
            <div className="box-border flex flex-col p-3 isolate border-2 border-gray-600 rounded-[12px] text-white">
              <p className="text-xs md:text-sm text-gray-400">Wallet</p>
              <div className="rounded-lg shadow-md text-white flex items-center justify-between space-x-4">
                {/* Wallet Information Section */}
                <div className="flex flex-col space-y-2">
                  {/* Wallet Amount and Growth */}
                  <div className="flex items-center space-x-2">
                    <p className="text-xl md:text-2xl">$20,802</p>
                    <span className="text-[10px] px-1 py-0.5 bg-[#9AE8BB] text-[#0F572D] rounded-full">
                      +20%
                    </span>
                  </div>

                  {/* Last Month Profit */}
                  <p className="text-xs md:text-sm text-gray-500">Last month profit: $5,678</p>
                </div>

                {/* Illustration Section */}
                <div className="relative">
                  <img
                    src="src/assets/images/money-transfer-e4 2.png"
                    alt="Wallet Illustration"
                    className="w-20 h-20 md:w-24 md:h-24 transform scale-x-[-1]"
                  />
                </div>
              </div>
            </div>
          </div>






          {/* Full-page animation when animating */}
          {isAnimating && (
            <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center">
              <div
                className="absolute top-10 left-0 animate-explode flex justify-center items-center w-full"
                style={{
                  background: 'url("src/assets/gif/e4d2c1d0da356797359acd9270bcdd77.gif") no-repeat center center',
                  backgroundSize: 'cover',
                  width: '100%',
                  height: '60%',
                  opacity: 1,
                  animation: 'backgroundAnimation 2.5s forwards',
                  zIndex: 1000,
                }}
              ></div>
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>

  );
}

export default Home;
