import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdCasino, MdSportsEsports } from 'react-icons/md';
import { GiCardPick } from 'react-icons/gi';
import { FaDice, FaTicketAlt } from 'react-icons/fa';

const rebateTabs = [
  { label: 'Lottery', icon: <FaTicketAlt className="text-lg" /> },
  { label: 'Casino', icon: <MdCasino className="text-lg" /> },
  { label: 'Sports', icon: <MdSportsEsports className="text-lg" /> },
  { label: 'Rummy', icon: <GiCardPick className="text-lg" /> },
  { label: 'Slots', icon: <FaDice className="text-lg" /> },
];

const sampleRebateLevels = [
  {
    level: 'L0',
    rebates: ['0.6%', '0.18%', '0.054%', '0.0162%', '0.00486%', '0.001458%'],
  },
  {
    level: 'L1',
    rebates: ['0.7%', '0.245%', '0.08575%', '0.030012%', '0.015054%', '0.003677%'],
  },
  {
    level: 'L2',
    rebates: ['0.8%', '0.27%', '0.095%', '0.035%', '0.018%', '0.004%'],
  },
  {
    level: 'L3',
    rebates: ['0.9%', '0.3%', '0.1%', '0.04%', '0.02%', '0.005%'],
  },
  {
    level: 'L4',
    rebates: ['1.0%', '0.35%', '0.12%', '0.05%', '0.025%', '0.006%'],
  },
];

const rebateData = {
  Lottery: sampleRebateLevels,
  Casino: sampleRebateLevels.map(lvl => ({
    ...lvl,
    rebates: lvl.rebates.map(rate => `${(parseFloat(rate) * 0.9).toFixed(3)}%`),
  })),
  Sports: sampleRebateLevels.map(lvl => ({
    ...lvl,
    rebates: lvl.rebates.map(rate => `${(parseFloat(rate) * 0.85).toFixed(3)}%`),
  })),
  Rummy: sampleRebateLevels.map(lvl => ({
    ...lvl,
    rebates: lvl.rebates.map(rate => `${(parseFloat(rate) * 0.95).toFixed(3)}%`),
  })),
  Slots: sampleRebateLevels.map(lvl => ({
    ...lvl,
    rebates: lvl.rebates.map(rate => `${(parseFloat(rate) * 1.05).toFixed(3)}%`),
  })),
};

const RebateRatio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Lottery');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 pb-10 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-700 flex items-center gap-2"
        >
          <FaChevronLeft />
          <span className="font-semibold text-blue-800">Back</span>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Rebate Ratio</h1>
        <div className="w-10" /> {/* Spacer for layout balance */}
      </div>

      {/* Tabs with icons */}
      <div className="flex gap-2 overflow-x-auto mb-5">
        {rebateTabs.map(tab => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition shadow whitespace-nowrap ${
              activeTab === tab.label
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-blue-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rebate Level Cards */}
      <div className="space-y-6">
        {rebateData[activeTab].map((item, idx) => (
          <div key={idx} className="bg-blue-50 rounded-xl p-4 shadow-md">
            <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2 mb-3">
              <span className="bg-blue-300 text-white rounded-full p-1 w-6 h-6 text-center font-bold text-sm">
                {item.level}
              </span>
              Rebate Level <span className="italic font-bold text-blue-900">{item.level}</span>
            </h2>
            <ul className="text-sm text-gray-700 divide-y">
              {item.rebates.map((rate, i) => (
                <li key={i} className="flex justify-between py-1">
                  <span>{i + 1} level lower level commission rebate</span>
                  <span className="text-blue-800 font-semibold">{rate}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RebateRatio;
