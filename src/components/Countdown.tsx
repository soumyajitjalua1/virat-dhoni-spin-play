import React from "react";

interface CountdownProps {
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ seconds }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-extrabold text-yellow-300">
      {seconds > 0 ? seconds : ""}
    </div>
  );
};

export default Countdown;
