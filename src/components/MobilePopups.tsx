import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MobilePopups = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenTerms = localStorage.getItem("hasSeenTerms");
    if (!hasSeenTerms) {
      setShowTerms(true);
    } else {
      setShowOffers(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem("hasSeenTerms", "true");
    setShowTerms(false);
    setShowOffers(true);
  };

  const handleDeposit = () => {
    navigate("/wallet");
    setShowOffers(false);
  };

  if (!showTerms && !showOffers) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center px-4">
      {showTerms && (
        <div className="bg-blue-100 text-blue-900 rounded-2xl p-4 max-w-sm w-full shadow-xl space-y-3 text-sm">
          <h2 className="text-lg font-bold text-center text-blue-800">Welcome To RICHBIG GAMES!</h2>
          <p>FOLLOW OUR LATEST INFORMATION AND NEWS IN RICHBIG GAMES OFFICIAL TELEGRAM</p>
          <p className="font-semibold">Important Announcement: Beware of Imitations!</p>
          <p>
            Dear Valued Members, we have noticed an increase in imitation of our PLATFORM, RichBig. To ensure you are on the legitimate RICHBIG website, please verify authenticity through our official channels. Stay vigilant and report any suspicious activity.
          </p>
          <p className="font-bold text-yellow-600">VIP GOLD REWARD for the month of 1 [Previous Month] TO 30 [Current Month]</p>
          <p>If you want to participate, keep inviting and make your own team for more chances of winning. Click the link below for more information.</p>
          <button
            onClick={handleAcceptTerms}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 font-semibold"
          >
            Accept
          </button>
        </div>
      )}

      {showOffers && (
        <div className=" text-white rounded-2xl p-4 max-w-sm w-full shadow-xl overflow-y-auto max-h-[90vh] mt-[47px]" style={{ backgroundColor: "rgb(82 119 224)" }}>
          <h2
            className="font-bold text-center mb-3"
            style={{ fontSize: "1.5rem" }}
          >
            Extra first deposit bonus
          </h2>
          <p className="text-sm text-center mb-4 text-gray-200">Each account can only receive rewards once</p>

          {[100000, 50000, 10000,5000, 1000,200].map((amount, index) => {
            const bonus = amount === 100000 ? 800 : amount === 50000 ? 500 : amount === 10000? 200: amount === 5000? 100 : amount === 1000? 20: 10;
            return (
              <div key={index} className="bg-blue-800 rounded-xl p-3 mb-4 shadow-md">
                <p className="text-sm font-semibold">
                  First deposit <span className="text-yellow-400">{amount}</span> <span className="float-right">+ ₹{bonus}.00</span>
                </p>
                <p className="text-xs mt-1">Deposit {amount} for the first time and you will receive {bonus} bonus</p>
                <div
                  className="rounded-full h-4 mt-2 text-center text-xs text-white font-semibold"
                  style={{ backgroundColor: "rgb(16,28,63)" }}
                >
                  0/{amount}
                </div>
                                <button
                  onClick={handleDeposit}
                  className="mt-2 bg-yellow-500 text-blue-900 font-bold px-4 py-1 rounded-full w-full"
                >
                  Deposit
                </button>
              </div>
            );
          })}

          <div className="flex justify-between items-center mt-4">
            <label className="text-sm flex items-center space-x-1">
              <input type="checkbox" className="accent-blue-500" />
              <span>No more reminders today</span>
            </label>
            <button
              onClick={() => setShowOffers(false)}
              className="bg-red-500 text-white rounded-full px-4 py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePopups;
