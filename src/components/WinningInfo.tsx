import React, { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";

const users = [
  { name: "Mem***HMF", amount: "₹19.60", avatar: "https://randomuser.me/api/portraits/men/11.jpg", gameIcon: "🧨" },
  { name: "Mem***WKC", amount: "₹50.96", avatar: "https://randomuser.me/api/portraits/women/44.jpg", gameIcon: "🎯" },
  { name: "Mem***ADN", amount: "₹39.74", avatar: "https://randomuser.me/api/portraits/women/50.jpg", gameIcon: "🎲" },
  { name: "Mem***WCA", amount: "₹48.02", avatar: "https://randomuser.me/api/portraits/women/51.jpg", gameIcon: "🪙" },
  { name: "Mem***DNS", amount: "₹80.12", avatar: "https://randomuser.me/api/portraits/men/59.jpg", gameIcon: "🐷" },
  { name: "Mem***JAT", amount: "₹32.60", avatar: "https://randomuser.me/api/portraits/men/32.jpg", gameIcon: "💰" },
  { name: "Mem***TOM", amount: "₹22.90", avatar: "https://randomuser.me/api/portraits/women/25.jpg", gameIcon: "🎉" },
  { name: "Mem***KAT", amount: "₹55.01", avatar: "https://randomuser.me/api/portraits/women/14.jpg", gameIcon: "🍀" },
  { name: "Mem***POP", amount: "₹75.56", avatar: "https://randomuser.me/api/portraits/men/22.jpg", gameIcon: "🎮" },
  { name: "Mem***LOL", amount: "₹68.45", avatar: "https://randomuser.me/api/portraits/men/17.jpg", gameIcon: "🐼" },
  { name: "Mem***MAK", amount: "₹45.00", avatar: "https://randomuser.me/api/portraits/women/9.jpg", gameIcon: "🪙" },
  { name: "Mem***DAD", amount: "₹14.80", avatar: "https://randomuser.me/api/portraits/men/5.jpg", gameIcon: "🧩" },
  { name: "Mem***RAY", amount: "₹99.99", avatar: "https://randomuser.me/api/portraits/women/63.jpg", gameIcon: "🎈" },
  { name: "Mem***VIK", amount: "₹74.26", avatar: "https://randomuser.me/api/portraits/men/35.jpg", gameIcon: "🦄" },
  { name: "Mem***YES", amount: "₹28.40", avatar: "https://randomuser.me/api/portraits/women/60.jpg", gameIcon: "🐉" },
  { name: "Mem***GIG", amount: "₹66.20", avatar: "https://randomuser.me/api/portraits/women/39.jpg", gameIcon: "🎀" },
  { name: "Mem***MAX", amount: "₹17.12", avatar: "https://randomuser.me/api/portraits/men/26.jpg", gameIcon: "🕹️" },
  { name: "Mem***VIP", amount: "₹20.22", avatar: "https://randomuser.me/api/portraits/men/10.jpg", gameIcon: "🧃" },
  { name: "Mem***RAJ", amount: "₹46.89", avatar: "https://randomuser.me/api/portraits/women/19.jpg", gameIcon: "🥇" },
  { name: "Mem***TIG", amount: "₹81.44", avatar: "https://randomuser.me/api/portraits/men/45.jpg", gameIcon: "🎰" },
];

const WinningInfo: React.FC = () => {
  const [visibleUsers, setVisibleUsers] = useState(users.slice(0, 5));
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (startIndex + 1) % users.length;
      const endIndex = (nextIndex + 5) % users.length;
      const newVisible =
        endIndex > nextIndex
          ? users.slice(nextIndex, endIndex)
          : [...users.slice(nextIndex), ...users.slice(0, endIndex)];

      setVisibleUsers(newVisible);
      setStartIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [startIndex]);

  return (
    <div className="p-4 rounded-xl shadow-md  text-white max-w-md mx-auto relative">
      <div className="space-y-2">
        {visibleUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between  px-3 py-2 rounded-xl" style={{ backgroundColor: "rgb(120 124 159)" }}>
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-[#2F47C2] rounded-full text-lg">
                {user.gameIcon}
              </div>
              <div className="text-xs leading-tight text-right">
                <div className="font-bold text-white">Receive {user.amount}</div>
                <div className="text-[10px] text-gray-300">Winning amount</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating help icon */}
      {/* <div className="absolute bottom-2 right-2 bg-white text-blue-500 rounded-full p-2 shadow-lg">
        <HelpCircle size={20} />
      </div> */}
    </div>
  );
};

export default WinningInfo;
