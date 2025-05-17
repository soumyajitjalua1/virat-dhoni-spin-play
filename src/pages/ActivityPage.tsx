import React from "react";
import { useNavigate } from "react-router-dom";
import FooterNavigation from '@/components/FooterNavigation';
import { link } from "fs";

const promoImages = [
  "https://www.pocket52.com/_ipx/s_2400x1200/images/landing-pages/poker-rules-resized.webp",
  "/IMG 1.webp",
  "/IMG 2.webp",
  "/IMG 3.webp",
  "/IMG 4.webp",
  "/IMG 5.webp",
  "/IMG 6.webp",
  "/IMG 7.webp",
  "/IMG 8.webp",
  "/IMG 9.webp",
  "/IMG 10.webp",
  "/IMG 11.webp"
];

const ActivityPage: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-white-400 min-h-screen p-4 space-y-6">
      {/* Header */}
      <div >
        <div className="bg-[#067FD0] text-center p-0 rounded-lg shadow-md">
            <img
            src="/Richbig logo.png"
            alt="Richbig Logo"
            className=" mx-auto h-12 mb-2"
            />

        </div>
        <h2 className="text-lg font-bold text-black">Activity</h2>
        <p className="text-sm text-gray-600">
          Please remember to follow the event page<br />
          We will launch user feedback activities from time to time
        </p>
      </div>

      {/* Top Icons */}
      <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium text-black">
        <div
        className="bg-[#067FD0] p-3 rounded-lg shadow-sm"
        onClick={() => navigate('/activity-award')}
      >
        <img src="https://cdn-icons-png.flaticon.com/512/8092/8092389.png" className="h-10 mx-auto mb-1" alt="Award" />
        Activity Award
      </div>
        <div className="bg-[#067FD0] p-3 rounded-lg shadow-sm" onClick={() => navigate('/rebate')}>
          <img src="https://cdn-icons-png.freepik.com/256/11521/11521933.png?semt=ais_hybrid" className="h-10 mx-auto mb-1" alt="Rebate" />
          Betting rebate
        </div>
        <div className="bg-[#067FD0] p-3 rounded-lg shadow-sm" onClick={() => navigate('/super-jackpot')}>
          <img src="https://cdn-icons-png.flaticon.com/512/8273/8273916.png" className="h-10 mx-auto mb-1" alt="Jackpot" />
          Super Jackpot
        </div>
        <div className="bg-[#067FD0] p-3 rounded-lg shadow-sm" onClick={() => navigate('/activity-details/:id')}>
          <img src="https://cdn-icons-png.flaticon.com/512/144/144506.png" className="h-10 mx-auto mb-1" alt="First Gift" />
          First gift
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#ffe7e7] p-3 rounded-lg shadow-sm text-black">
          <img src="https://www.tirangagame.top/assets/png/signInBanner-33f86d3f.png" className="w-full rounded-md mb-2" alt="Gift" />
          <h4 className="font-semibold">Gifts</h4>
          <p className="text-sm">Enter the redemption code to receive gift rewards</p>
        </div>
        <div className="bg-[#fff3cc] p-3 rounded-lg shadow-sm text-black">
          <img src="https://www.tirangagame.top/assets/png/giftRedeem-45917887.png" className="w-full rounded-md mb-2" alt="Bonus" />
          <h4 className="font-semibold">Attendance bonus</h4>
          <p className="text-sm">The more consecutive days you sign in, the higher the reward will be.</p>
        </div>
      </div>

      {/* Banner Section */}
      <div className="space-y-4 mt-6 mb-6">
        {promoImages.map((src, index) => (
          <img key={index} src={src} alt={`Promo ${index + 1}`} className="rounded-lg w-full shadow-md" />
        ))}
      </div>
        {/* Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0">
            <FooterNavigation />
        </div>
    </div>
  );
};

export default ActivityPage;
