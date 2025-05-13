import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserFriends, FaChevronLeft, FaRegCopy, FaChevronRight,
  FaHeadset, FaDollarSign, FaChartBar
} from 'react-icons/fa';
import FooterNavigation from '@/components/FooterNavigation';
import { link } from 'fs';

const Promotion: React.FC = () => {
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState('');

  useEffect(() => {
    const generateCode = () => {
      const randomCode = Math.floor(1000000000 + Math.random() * 9000000000);
      setInvitationCode(randomCode.toString());
    };
    generateCode();
  }, []);

  return (
    <div className="bg-white min-h-screen px-4 py-4 text-gray-800">
      {/* Back Button */}

      {/* Agency Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-4 text-center shadow-lg mb-4 relative">
        <div className="flex items-center justify-between relative">
            {/* Back Button on the left */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate(-1)}>
            <FaChevronLeft className="text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Back</span>
            </div>
            {/* Centered Agency title */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-white m-0">
            Agency
            </h1>
            {/* Empty div for spacing on the right */}
            <div style={{ width: 60 }}></div>
        </div>
        <p className="text-4xl font-bold mt-2">0</p>
        <p className="text-sm mt-1">Yesterday's total commission</p>
        <p className="text-xs mt-1 text-blue-100">Upgrade the level to increase commission income</p>
        </div>

      {/* Subordinate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Direct Subordinates Card */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 text-gray-700 mb-3">
            <FaUserFriends className="text-blue-500" />
            Direct Subordinates
          </h2>
          <table className="w-full text-sm text-gray-700">
            <tbody>
              <tr className="border-t"><td className="py-1">Number of register</td><td className="text-right">0</td></tr>
              <tr className="border-t"><td className="py-1">Deposit number</td><td className="text-right">0</td></tr>
              <tr className="border-t"><td className="py-1">Deposit amount</td><td className="text-right">0</td></tr>
              <tr className="border-t"><td className="py-1">First deposit users</td><td className="text-right">0</td></tr>
            </tbody>
          </table>
        </div>

        {/* Team Subordinates Card */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 text-gray-700 mb-3">
            <FaUserFriends className="text-blue-500" />
            Team Subordinates
          </h2>
          <table className="w-full text-sm text-gray-700">
            <tbody>
              <tr className="border-t"><td className="py-1">Number of register</td><td className="text-right">0</td></tr>
              <tr className="border-t"><td className="py-1">Deposit number</td><td className="text-right">0</td></tr>
              <tr className="border-t"><td className="py-1">Deposit amount</td><td className="text-right">0</td></tr>
              <tr className="border-t"><td className="py-1">First deposit users</td><td className="text-right">0</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invitation Button */}
      <div className="text-center mb-4">
        <button className="bg-blue-500 text-white font-medium py-2 px-6 rounded-full shadow hover:bg-blue-600">
          INVITATION LINK
        </button>
      </div>

      {/* Copy Code */}
      <div className="bg-gray-100 rounded-lg flex justify-between items-center px-4 py-3 shadow-sm mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FaRegCopy className="text-blue-500" />
          <span>Copy invitation code</span>
        </div>
        <span className="font-semibold text-gray-900">{invitationCode}</span>
      </div>

      {/* Navigation Options */}
      <div className="space-y-3 mb-6">
        {[
            { icon: <FaDollarSign />, label: 'Commission detail', link: '/commission-details' },
            { icon: <FaChartBar />, label: 'Invitation rules', link: '/invitation-rules' },
            { icon: <FaHeadset />, label: 'Agent line customer service', link: '/customer-service' },
            { icon: <FaDollarSign />, label: 'Rebate ratio', link: '/rebate-ratio' },
        ].map(({ icon, label, link }) => (
            <div
            key={label}
            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer"
            onClick={() => navigate(link)}
            >
            <div className="flex items-center gap-2 text-gray-700">
                {icon}
                <span>{label}</span>
            </div>
            <FaChevronRight className="text-gray-500" />
            </div>
        ))}
        </div>

      {/* Promotion Data */}
      <div className="bg-gray-100 rounded-lg px-4 py-4 shadow-sm">
        <h2 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
          <FaUserFriends />
          Promotion Data
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 ">
          <div>
            <p className="font-medium">0</p>
            <p>This Week</p>
          </div>
          <div>
            <p className="font-medium">0</p>
            <p>Total commission</p>
          </div>
          <div>
            <p className="font-medium">0</p>
            <p>Direct subordinate</p>
          </div>
          <div>
            <p className="font-medium">0</p>
            <p>Total number of subordinates in the team</p>
          </div>
        </div>
        <div className='p-5'></div>
      </div>
        {/* Footer Navigation */}
        {/* <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg"> */}
        {/* </div> */}
        <FooterNavigation />
    </div>
  );
};

export default Promotion;
