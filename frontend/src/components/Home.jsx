import React, { useState, useEffect } from "react";
import "../Styles/Tasks.css";
import Logo from "../utils/Logo";
import Footer from "./Footer";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeData, fetchCoinData, transferCoins , fetchStats} from "../../store/actions/homeActions";
import { ImCross } from "react-icons/im";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../components/Loader';
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);


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

useEffect(() => {
  if (statsData) {
    // Assuming the data has multiple months, here we'll get the keys (months) dynamically.
    const dynamicLabels = Object.keys(statsData.monthly || {}); // Using the months as labels
    
    const totalMultiplierData = [];
    const monthlyMultiplierData = [];
    const finalValueData = [];

    // Fill the data arrays with the values from statsData
    dynamicLabels.forEach((label) => {
      totalMultiplierData.push(statsData.total?.multiplier || 0); // Adding the total multiplier value
      monthlyMultiplierData.push(statsData.monthly[label]?.multiplier || 0); // Adding the monthly multiplier value for each month
      finalValueData.push(statsData.final_value || 0); // Adding the final value for each month (assuming it's constant across months)
    });

    setChartData({
      labels: dynamicLabels, // Labels represent the months or time periods
      datasets: [
        {
          label: "Total Multiplier", // Dataset for Total Multiplier
          data: totalMultiplierData, // Total multiplier data over time
          borderColor: "rgba(99, 57, 249, 1)", // Line color for total multiplier
          borderWidth: 2,
          pointBackgroundColor: "rgba(99, 57, 249, 1)", // Point color
          tension: 0.4, // Smoothness of the line
          fill: true, // Fill under the line
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "rgba(99, 57, 249, 0.8)");
            gradient.addColorStop(1, "rgba(255, 0, 255, 0.2)");
            return gradient;
          },
        },
        {
          label: "Monthly Multiplier", // Dataset for Monthly Multiplier
          data: monthlyMultiplierData, // Monthly multiplier data over time
          borderColor: "rgb(242,20,143)", // Line color for monthly multiplier
          borderWidth: 2,
          pointBackgroundColor: "rgb(242,20,143)", // Point color
          tension: 0.4,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "rgba(255, 165, 0, 0.8)");
            gradient.addColorStop(1, "rgba(255, 255, 0, 0.2)");
            return gradient;
          },
        },
        {
          label: "Final Value", // Dataset for Final Value
          data: finalValueData, // Final value data over time
          borderColor: "rgba(0, 255, 0, 1)", // Line color for final value
          borderWidth: 2,
          pointBackgroundColor: "rgba(0, 255, 0, 1)", // Point color
          tension: 0.4,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "rgba(0, 255, 0, 0.8)");
            gradient.addColorStop(1, "rgba(0, 255, 255, 0.2)");
            return gradient;
          },
        },
      ],
    });
  }
}, [statsData]);



  // Line chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // Legend text color in dark mode
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Tooltip background
        titleColor: "#fff", // Tooltip title text
        bodyColor: "#fff", // Tooltip body text
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#fff", // X-axis labels color
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff", // Y-axis labels color
        },
      },
    },
  };


// Toggle theme (light/dark)
const toggleTheme = () => {
  setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
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
         <Header/>
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
            <img src="src/images/Ellipse 8.png" alt="" style={{ width: '100%', height: '100%' }} />
          </div>
      {/* Chart Container */}
{isChartOpen && (
  <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-80 p-4">
         {/* Close Button */}
    
      <button onClick={handleChartToggle} className="absolute top-5 right-5 text-gray-400 hover:text-gray-200 focus:outline-none transition duration-300">
                    <ImCross size={20} />
                </button>
    <div className="relative bg-dark p-6 rounded-xl shadow-lg max-w-full sm:max-w-md w-full h-auto">
      {/* Chart Component */}
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />


    </div>
  </div>
)}


          {/* Wallet Section */}
          <div className="mt-auto px-3 py-4 mb-10">
            <div className="box-border flex flex-col p-3 isolate border-2 border-gray-600 rounded-[12px] text-white">
              <p className="text-xs md:text-sm text-gray-400">Wallet</p>
              <div className="rounded-lg shadow-md text-white flex items-center justify-between space-x-4">
                {/* Wallet Information Section */}
                <div className="flex flex-col space-y-2">
                  {/* Wallet Amount and Growth */}
                  <div className="flex items-center space-x-2">
                    <p className="text-xl md:text-2xl flex">   <span>
                <img src="src/assets/logo/U.png" alt="" className="w-5 h-5 mt-1" />
              </span>   <span>{statsData &&  statsData.total && statsData.total.multiplier ? statsData.total.multiplier : "0"}</span></p>
                    <span className="text-[10px] px-1 py-0.5 bg-[#9AE8BB] text-[#0F572D] rounded-full">
                      +20%
                    </span>
                  </div>

                  {/* Last Month Profit */}
                  <p className="text-xs md:text-sm text-gray-500">Last month profit: {statsData &&  statsData.monthly && statsData.monthly.multiplier ? statsData.monthly.multiplier : "0"}</p>
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
