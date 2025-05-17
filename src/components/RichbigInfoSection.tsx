import React from "react";

const gameLogos = [
  { name: "CQ9", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdz34hyadFDZWFWZQzuVM7binJaBfW0rVOHw&s" },
  { name: "Microgaming", src: "https://images-platform.99static.com//nlA05Ouj-aWL0QswLpqzBL9hVzU=/216x0:1536x1320/fit-in/500x500/99designs-contests-attachments/113/113118/attachment_113118844" },
  { name: "JDB", src: "https://cdn.dribbble.com/userupload/15838721/file/original-a11440c7c02267377eeb021fedd21dc4.jpg?resize=400x0" },
  { name: "Evolution", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOEOWCwNQ-PMFubipjPwd_HgE_lQsSrGEyUQ&s" },
  { name: "JILI", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB48kATLtyVm9824RntK5nfb3Oy324LE1WGg&s.png" },
  { name: "AG", src: "https://penji.co/wp-content/uploads/2022/08/2.-moonstruck-coffee.jpg.webp" },
];

const TirangaInfoSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-rose-200 to-pink-400 text-white rounded-xl p-5 max-w-md mx-auto space-y-4 shadow-md" >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-white italic">
            <img src="/Richbig logo.png" alt="logo" />
        </div>
        <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">+18</div>
      </div>

      {/* Logos */}
      <div className="grid grid-cols-3 gap-3">
        {gameLogos.map((logo) => (
          <div
            key={logo.name}
            className="bg-white flex items-center justify-center p-2 rounded-md h-13 shadow-sm"
          >
            <img src={logo.src} alt={logo.name} className="h-14 w-full object-contain" />

          </div>
        ))}
      </div>

      {/* Info bullets */}
      <ul className="space-y-2 text-sm text-blue-500">
        <li>🔹 The platform advocates fairness, justice, and openness. We mainly operate fair lottery, blockchain games, live casinos, and slot machine games.</li>
        <li>🔹 Tiranga works with more than 10,000 online live game and slot games, all of which are verified fair games.</li>
        <li>🔹 Tiranga supports fast deposit and withdrawal, and looks forward to your visit.</li>
      </ul>

      {/* Warnings */}
      <div className="text-xs text-black-700 pt-2">
        <p className="text-black">Gambling can be addictive, please play rationally.</p>
        <p className="text-red-500">Tiranga only accepts customers above the age of 18.</p>
      </div>
    </div>
  );
};

export default TirangaInfoSection;
