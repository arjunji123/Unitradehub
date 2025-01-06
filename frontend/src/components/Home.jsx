import React, { useState, useEffect } from "react";
import "../Styles/Tasks.css";
import Logo from "../utils/Logo";
import Footer from "./Footer";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeData, fetchCoinData, transferCoins, fetchStats } from "../../store/actions/homeActions";
import { ImCross } from "react-icons/im";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../components/Loader';
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Home() {
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state.apiData.data);
  const userData = apiData?.me?.data || null;
  const pendingCoin = apiData?.coin?.data || null;
  const statsData = apiData?.stats?.data || null;
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light'); // Theme state: light or dark

  const [isChartOpen, setIsChartOpen] = useState(false); // New state to control chart visibility

  // Handle the chart visibility toggle
  const handleChartToggle = () => {
    setIsChartOpen(!isChartOpen);
  };

  useEffect(() => {
    // Fetch user and coin data on component mount
    const fetchData = async () => {
      try {
        await dispatch(fetchCoinData());
        await dispatch(fetchMeData());
        await dispatch(fetchStats());
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
    fetchData();
  }, [dispatch]);
  const handleNavigate = () => {
    navigate('/Profile');
  };
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

  // Initial state for chart data
  const [chartData, setChartData] = useState({
    labels: [], // Dynamic labels for months or periods
    datasets: [
      // Placeholder, will be dynamically populated
    ],
  });

  useEffect(() => {
    if (statsData) {
      const dynamicLabels = Object.keys(statsData.monthly || {}); 
      const finalValue = statsData.final_value;
      const totalMultiplierData = Array(dynamicLabels.length).fill(statsData.total?.multiplier || 0); // Set total multiplier data

      // Set chart data and options
      setChartData({
        labels: dynamicLabels, 
        datasets: [
          {
            label: "Total Multiplier",
            data: totalMultiplierData,
            borderColor: "rgba(99, 57, 249, 1)", // Purple color for the line
            borderWidth: 3, // Increased border width
            pointBackgroundColor: "rgba(99, 57, 249, 1)", 
            tension: 0.3, // Reduced tension for angular lines
            fill: false, // No fill under the line
            backgroundColor: "rgba(99, 57, 249, 0.2)", // Light fill color
            pointRadius: 5, // Bigger points to make them noticeable
          },
          {
            label: "Final Value",
            data: Array(dynamicLabels.length).fill(finalValue || 0), // Set final value as same for each month
            borderColor: "rgba(0, 255, 0, 1)", // Green color for the line
            borderWidth: 3, 
            pointBackgroundColor: "rgba(0, 255, 0, 1)", 
            tension: 0.3,
            fill: false,
            backgroundColor: "rgba(0, 255, 0, 0.2)", // Light fill color
            pointRadius: 5, 
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow chart to fill container
          scales: {
            y: {
              beginAtZero: false, 
              grid: {
                color: "rgba(0, 0, 0, 0.1)", // Subtle grid lines for a cleaner look
              },
            },
            x: {
              grid: {
                color: "rgba(0, 0, 0, 0.05)", // Light grid lines for x-axis
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background for tooltip
              titleColor: "#fff", // White title color
              bodyColor: "#fff", // White body color
              borderColor: "#fff", // White border
              borderWidth: 1, // Slight border for tooltip
              callbacks: {
                label: (tooltipItem) => {
                  // Customize tooltip label format
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}`;
                },
              },
            },
          },
          legend: {
            display: true, // Show legend
            position: "top", // Place legend at top
            labels: {
              color: "#333", // Change legend color for better contrast
            },
          },
        },
      });
    }
  }, [statsData]);
  
   useEffect(() => {
    // Disable drag and touch gestures
    const preventDrag = (e) => e.preventDefault();
    const preventTouch = (e) => e.preventDefault();

    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("touchmove", preventTouch);
    };
  }, []);


  






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
          <Header />
          <div style={{
            position: 'absolute',
            width: '239px',
            height: '239px',
            left: '160px',
            top: '116px',
            background: 'rgba(99, 57, 249, 0.25',
            filter: 'blur(100px)',
          }}>
            <img src="src/images/Ellipse 9.png" alt="" style={{ width: '100%', height: '100%' }} />
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

            <p className="text-2xl font-semibold flex">
              <span>
                <img src="src/assets/logo/U.png" alt="" className="w-6 h-6 mt-1" />
              </span>
              <span>{userData ? userData.coins : "0"}</span>
            </p>

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
            <img src="src/images/Ellipse 8.png" alt="" style={{ width: '100%', height: '100%' }} />
          </div>
          {/* Chart Container */}
          {isChartOpen && (
            <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black  p-4">
              {/* Close Button */}

              <button onClick={handleChartToggle} className="absolute top-5 right-5 text-gray-400 hover:text-gray-200 focus:outline-none transition duration-300">
                <ImCross size={20} />
              </button>
              <div className="relative  p-6 rounded-xl shadow-lg max-w-full sm:max-w-md w-full h-[500px]">
                {/* Chart Component */}
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />


              </div>
            </div>
          )}

          {/* Wallet Section */}
          <div className="mt-auto px-3 py-4 mb-10">
          {/* <div onClick={handleClick} className="flex justify-center items-center my-2">
              <img className="w-44 h-44  object-cover" src="src/images/coin.png" alt="" />
            </div> */}
             {/* Image container with animation when clicked */}
<div onClick={handleClick} className="flex justify-center items-center my-2 relative">
  <div
    className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
    style={{
      background: 'url("src/assets/gif/earthatnightfromspace_preview-ezgif.com-optimize.gif") no-repeat center center',
      backgroundSize: 'cover',
      animation: isAnimating ? 'backgroundAnimation 2.5s forwards' : 'none',
    }}
  ></div>
  <img 
    className="w-44 h-44 object-cover z-10" 
    src="src/images/coin.png" 
    alt="" 
  />
</div>
            <div className="box-border flex flex-col p-3 isolate border-2 border-gray-600 rounded-[12px] text-white">
              <p className="text-xs md:text-sm text-gray-400">Wallet</p>
              <div className="rounded-lg shadow-md text-white flex items-center justify-between space-x-4">
                {/* Wallet Information Section */}
                <div className="flex flex-col space-y-2">
                  {/* Wallet Amount and Growth */}
                  <div className="flex items-center space-x-2">
                    <p className="text-xl md:text-2xl flex">   <span>
                      <img src="src/assets/logo/U.png" alt="" className="w-5 h-5 mt-1" />
                    </span>   <span>{statsData && statsData.total && statsData.total.multiplier ? statsData.total.multiplier : "0"}</span></p>
                  </div>

                  {/* Last Month Profit */}
                  <p className="text-xs md:text-sm text-gray-500">Last month profit: {statsData && statsData.monthly && statsData.monthly.multiplier ? statsData.monthly.multiplier : "0"}</p>
                </div>

                {/* Illustration Section */}
                <div className="relative">
                  <img
                    src="src/images/money-transfer-e4 2.png"
                    alt="Wallet Illustration"
                    className="w-20 h-20 md:w-24 md:h-24 transform scale-x-[-1]"
                    onClick={handleChartToggle}
                  />
                </div>
              </div>
            </div>
          </div>



        </div>
      )}
      <Footer />
    </div>

  );
}

export default Home;
