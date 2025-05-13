import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  RotateCcw,
  Wallet,
  User,
  Diamond,
} from "lucide-react";

const FooterNavigation: React.FC = () => {
  const active = "text-blue-400";
  const inactive = "text-gray-400";
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 text-white flex justify-between items-center px-4 py-2 shadow-inner z-50" style={{ backgroundColor: "rgb(49 81 181 / var(--tw-bg-opacity, 1))" }}>
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Home className={`${location.pathname === "/" ? active : inactive} w-6 h-6`} />
        <span className={`text-xs mt-1 ${location.pathname === "/" ? active : ""}`}>Home</span>
      </div>
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => navigate("/activity")}
      >
        <RotateCcw className={`${location.pathname === "/activity" ? active : inactive} w-6 h-6`} />
        <span className={`text-xs mt-1 ${location.pathname === "/activity" ? active : ""}`}>Activity</span>
      </div>

      {/* Center Icon */}
      <div className="relative flex-1 flex justify-center" onClick={() => navigate("/promotion")}>
        <div className="absolute -top-6 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full p-3 shadow-lg z-10">
          <Diamond className={`${location.pathname === "/promotion" ? active : inactive} text-white w-6 h-6`} />
        </div>
        <span className={`${location.pathname === "/promotion" ? active :""}text-xs mt-8 text-white`}>Promotion</span>
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => navigate("/wallet")}
      >
        <Wallet className={`${location.pathname === "/wallet" ? active : inactive} w-6 h-6`} />
        <span className={`text-xs mt-1 ${location.pathname === "/wallet" ? active : ""}`}>Wallet</span>
      </div>
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => navigate("/account")}
      >
        <User className={`${location.pathname === "/account" ? active : inactive} w-6 h-6`} />
        <span className={`text-xs mt-1 ${location.pathname === "/account" ? active : ""}`}>Account</span>
      </div>
    </div>
  );
};

export default FooterNavigation;