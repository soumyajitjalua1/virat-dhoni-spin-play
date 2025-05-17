import React from "react";
import { Crown, HelpCircle } from "lucide-react";

const topThree = [
  {
    name: "Rav**an",
    earnings: "₹206,015,453.00",
    position: "N01",
    badge: "gold",
    color: "bg-gradient-to-b from-yellow-400 to-orange-400",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
  },
  {
    name: "RrR***VIP",
    earnings: "₹196,007,644.00",
    position: "N02",
    badge: "silver",
    color: "bg-gradient-to-b from-gray-300 to-gray-400",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "AMA***LOT",
    earnings: "₹126,840,616.00",
    position: "N03",
    badge: "bronze",
    color: "bg-gradient-to-b from-orange-300 to-orange-500",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const otherUsers = [
  { rank: 4, name: "Sou*** 🌸", earnings: "₹22,471,400.00", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { rank: 5, name: "HAT***ACK", earnings: "₹12,348,900.00", avatar: "https://randomuser.me/api/portraits/women/3.jpg", wheel: true },
  { rank: 6, name: "Mem***6TS", earnings: "₹7,272,047.86", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { rank: 7, name: "Mem***XX7", earnings: "₹4,189,833.00", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { rank: 8, name: "Mem***RAK", earnings: "₹2,745,960.00", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
];

const EarningLeaderboard: React.FC = () => {
  return (
    <div className="p-4 w-full max-w-md mx-auto  text-white rounded-2xl ">
        
    
        {/* Top 3 users */}
      {/* Top 3 podium */}
      <div className="flex justify-between items-end gap-2 mb-6">
        {topThree.map((user, idx) => (
          <div
            key={user.name}
            className={`flex-1 flex flex-col items-center p-2 rounded-xl ${user.color} text-center`}
            style={{ transform: `translateY(${idx === 1 ? "0px" : "20px"})` }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <Crown
              className={`mt-1 ${
                user.badge === "gold"
                  ? "text-yellow-300"
                  : user.badge === "silver"
                  ? "text-gray-300"
                  : "text-orange-500"
              }`}
            />
            <span className="font-bold text-sm">{user.name}</span>
            <span className="text-xs">{user.earnings}</span>
          </div>
        ))}
      </div>

      {/* Other users */}
      <div className="space-y-2 relative">
        {otherUsers.map((user) => (
          <div
            key={user.rank}
            className="bg-gradient-to-br from-rose-200 to-pink-500 flex justify-between items-center rounded-xl px-3 py-2" 
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold w-5">{user.rank}</span>
              <img src={user.avatar} alt={user.name} className="text-blue-500 w-8 h-8 rounded-full" />
              <span className="text-blue-500 text-sm font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className=" bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                {user.earnings}
              </span>
            </div>
          </div>
        ))}

        
      </div>
    </div>
  );
};

export default EarningLeaderboard;
