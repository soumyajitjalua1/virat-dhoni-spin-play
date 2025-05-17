import React from "react";

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="text-xl font-semibold">
      Balance: ₹{balance}
    </div>
  );
};

export default WalletBalance;
