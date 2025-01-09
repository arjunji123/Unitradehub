import React, { useState, useEffect, useMemo } from "react";
import { BsCoin } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { fetchHistory, fetchWithdrawal, userApprove } from "../../store/actions/homeActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const historyData = useSelector((state) => state.apiData.data.history?.data || []);
  const withdrawal = useSelector((state) => state.apiData.data.withdrawal?.data || []);
  const [activeTab, setActiveTab] = useState("History");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeDiv, setActiveDiv] = useState(null);
  const [transaction, setTransaction] = useState(null);  // Initialize transaction state

  const handleDivClick = (index, transaction) => {
    setActiveDiv(index);
    setIsPopupOpen(true); // Open the pop-up on div click
    setTransaction(transaction);  // Set the selected transaction to display in the pop-up
  };
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchHistory());
        await dispatch(fetchWithdrawal());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);


  useEffect(() => {
    // Select the specific div using a class or ID
    const targetDiv = document.querySelector('.no-drag'); // Example with class 'no-drag'

    // Prevent drag events on the specific div
    const preventDrag = (e) => {
      e.preventDefault();
    };

    // Prevent touchmove events on the specific div
    const preventTouch = (e) => {
      e.preventDefault(); // Prevent any touch gesture (drag) on the target div
    };

    if (targetDiv) {
      // Add event listeners only to the specific div
      targetDiv.addEventListener("dragstart", preventDrag);
      targetDiv.addEventListener("touchmove", preventTouch, { passive: false });
    }

    return () => {
      if (targetDiv) {
        targetDiv.removeEventListener("dragstart", preventDrag);
        targetDiv.removeEventListener("touchmove", preventTouch);
      }
    };
  }, []);



  // Group transactions by date
  const groupByDate = (data) =>
    data.reduce((acc, item) => {
      const date = new Date(item.transaction_date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

  // Group transactions by date
  const groupByDateWith = (data) =>
    data.reduce((acc, item) => {
      const date = new Date(item.date_entered).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

  const groupedTransactions = useMemo(() => groupByDate(historyData), [historyData]);
  const groupedWithdrawals = useMemo(() => groupByDateWith(withdrawal), [withdrawal]);

  // Handle tab switch
  const handleTabSwitch = (tab) => setActiveTab(tab);

  // Handle approve action
  const handleApprove = async (transaction_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
      customClass: {
        popup: "bg-gray-800 text-white rounded-lg shadow-lg w-[90%] sm:w-[400px]", // Popup styling
        title: "text-white text-sm sm:text-base font-bold", // Title styling
        content: "text-gray-300 text-xs sm:text-sm", // Content styling
        confirmButton: "bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded",
        cancelButton: "bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Show loader
        try {
          await dispatch(userApprove({ transaction_id }));
          await dispatch(fetchWithdrawal());
          await dispatch(fetchHistory()); // Refresh history data
          Swal.fire({
            title: "Approved!",
            text: "The transaction has been approved.",
            icon: "success",
            customClass: {
              popup: "bg-gray-800 text-white rounded-lg shadow-lg w-[90%] sm:w-[400px]",
              title: "text-white text-sm sm:text-base font-bold",
              content: "text-gray-300 text-xs sm:text-sm",
            },
          });
        } catch (error) {
          Swal.fire({
            title: "Failed!",
            text: "The transaction could not be approved.",
            icon: "error",
            customClass: {
              popup: "bg-gray-800 text-white rounded-lg shadow-lg w-[90%] sm:w-[400px]",
              title: "text-white text-sm sm:text-base font-bold",
              content: "text-gray-300 text-xs sm:text-sm",
            },
          });
        } finally {
          setLoading(false); // Hide loader
        }
      }
    });
  };

  return (
    // <div  className="bg-white min-h-screen flex justify-center overflow-hidden" >
    <div className="bg-white flex justify-center min-h-screen font-Inter overflow-hidden">

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-black text-white w-full max-w-lg flex flex-col px-4 overflow-hidden">

          <div className="flex items-center justify-between py-4 hide-scrollbar overflow-y-auto">
            <button onClick={() => navigate(-1)} className="text-2xl text-white cursor-pointer">
              <FaChevronLeft />
            </button>
          </div>

          {/* Tab Navigation */}
          <div id="no-drag" className="flex items-center bg-[#1C1C1E] justify-between rounded-xl hide-scrollbar overflow-y-auto">
            <button
              className={`flex-1 py-2.5 text-center font-medium transition-all duration-200 ${activeTab === "History" ? "bg-[#282828] rounded-xl text-white" : "text-gray-100"
                }`}
              onClick={() => handleTabSwitch("History")}
            >
              History
            </button>
            <button
              className={`flex-1 py-2.5 text-center font-medium transition-all duration-200 ${activeTab === "Withdrawal" ? "bg-[#282828] rounded-xl text-white" : "text-gray-100"
                }`}
              onClick={() => handleTabSwitch("Withdrawal")}
            >
              Withdrawal
            </button>
          </div>



          <div id="content" className="flex-grow py-4 h-[400px] overflow-y-auto hide-scrollbar" style={styles.content}>
            {activeTab === "History" && (
              <>
                {Object.keys(groupedTransactions).length > 0 ? (
                  Object.keys(groupedTransactions).map((date) => (
                    <div key={date} className="mb-6">
                      <p className="text-sm font-semibold text-gray-400 mb-3">{date}</p>
                      {groupedTransactions[date].map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between py-3">
                          <div className="flex items-center space-x-3">
                            {/* <BsCoin size={30} className="text-white" /> */}
                            <img src="src/assets/logo/U.png" className="w-5 h-5" alt="" />
                            <h3 className="text-sm font-semibold capitalize">{transaction.title}</h3>
                          </div>
                          <p className="text-sm font-medium">
                            {transaction.pending_coin === 0
                              ? `${transaction.earn_coin > 0 ? "" : ""}${transaction.earn_coin} Coins`
                              : ` ${transaction.pending_coin} Coins`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No transactions found.</p>
                )}
              </>
            )}

            {activeTab === "Withdrawal" && (
              <>
                {Object.keys(groupedWithdrawals).length > 0 ? (
                  Object.keys(groupedWithdrawals).map((date) => (
                    <div>
                      {Object.keys(groupedWithdrawals).map((date) => (
                        <div key={date} className="mb-6">
                          <p className="text-sm font-semibold text-gray-400 mb-3">{date}</p>
                          {groupedWithdrawals[date].map((transaction, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between mx-2 py-3 ${activeDiv === index
                                ? 'transition-all transform scale-105 bg-gray-800 px-4 rounded-xl shadow-xl ring-2 ring-gray-600'
                                : 'bg-transparent'
                                }`}
                              onClick={() => handleDivClick(index, transaction)} // Trigger click event
                            >
                              <div className="flex items-center space-x-3">
                                <img src="src/assets/logo/U.png" className="w-7 h-7" alt="" />
                                <h3 className="text-sm font-semibold capitalize">
                                  {transaction.title}
                                  <p className="text-xs text-gray-400">
                                    {Math.abs(transaction.earn_coin)} Coins
                                  </p>
                                </h3>
                              </div>
                              <button
                                onClick={() => handleApprove(transaction.transaction_id)}
                                className="leading-none capitalize px-4 py-2 text-[13px] rounded-full bg-[#282828] flex text-white font-semibold hover:bg-[#1C1C1E] transition duration-200 ease-in-out"
                              >
                                {transaction && transaction.status ? 'Approve' : 'Waiting'}
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Pop-Up */}
                      {/* Pop-Up */}
                      {isPopupOpen && transaction && (
                        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">

                          {/* Close Button */}
                          <button
                            onClick={() => setIsPopupOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none transition duration-300 transform hover:scale-110"
                          >
                            <ImCross size={22} />
                          </button>

                          {/* Modal Content */}
                          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-lg md:max-w-3xl transform transition-all duration-300 scale-95 hover:scale-100">

                            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Transaction Details</h3>

                            <table className="min-w-full table-auto text-white text-sm md:text-base">
                              <tbody>
                                {/* Transaction Rows */}
                                <tr className="hover:bg-gray-700 transition duration-200 rounded-md">
                                  <td className="py-2 px-4 border-b border-gray-700">Transaction ID</td>
                                  <td className="py-2 px-4 border-b border-gray-700">{transaction.trans_id}</td>
                                </tr>
                                <tr className="hover:bg-gray-700 transition duration-200 rounded-md">
                                  <td className="py-2 px-4 border-b border-gray-700">Date</td>
                                  <td className="py-2 px-4 border-b border-gray-700">{new Date(transaction.date_entered).toLocaleString()}</td>
                                </tr>
                                <tr className="hover:bg-gray-700 transition duration-200 rounded-md">
                                  <td className="py-2 px-4 border-b border-gray-700">Coins</td>
                                  <td className="py-2 px-4 border-b border-gray-700">{Math.abs(transaction.earn_coin)} Coins</td>
                                </tr>
                                <tr className="hover:bg-gray-700 transition duration-200 rounded-md">
                                  <td className="py-2 px-4 border-b border-gray-700">Status</td>
                                  <td className="py-2 px-4 border-b border-gray-700">{transaction.status}</td>
                                </tr>
                                <tr className="hover:bg-gray-700 transition duration-200 rounded-md">
                                  <td className="py-2 px-4 border-b border-gray-700">UTR Number</td>
                                  <td className="py-2 px-4 border-b border-gray-700">{transaction.utr_no}</td>
                                </tr>
                              </tbody>
                            </table>

                          </div>
                        </div>
                      )}



                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No transactions found.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
const styles = {
  content: {
    // height: '100vh', // Full viewport height
    overflowY: 'auto', // Enable vertical scrolling
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  },
};
export default TransactionHistory;
