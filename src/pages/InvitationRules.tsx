import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InvitationRules: React.FC = () => {
  const navigate = useNavigate();

  const rules = [
    {
      id: '01',
      text:
        'There are 6 subordinate levels in inviting friends. If A invites B, B is A\'s level 1 subordinate. If B invites C, C is B\'s level 1 and A\'s level 2 subordinate, and so on up to level 6.'
    },
    {
      id: '02',
      text:
        'Invite friends using the official invitation link or code to ensure they register as your level 1 subordinate.'
    },
    {
      id: '03',
      text:
        'When your invitee registers and deposits using your code, your commission is received instantly.'
    },
    {
      id: '04',
      text:
        'Commissions from yesterday are calculated at 01:00 daily and transferred to your wallet after completion.'
    },
    {
      id: '05',
      text:
        'Commission rates vary based on your agency level. Higher levels unlock better rates.'
    },
    {
      id: '06',
      text:
        'The commission percentage depends on your membership level. Different game types have different payout rates.'
    },
    {
      id: '07',
      text:
        'The top 20 in commission rankings will receive random bonus rewards.'
    }
  ];

  const levels = [
    { level: 'L0', number: '0', betting: '0', deposit: '0' },
    { level: 'L1', number: '10', betting: '500K', deposit: '100K' },
    { level: 'L2', number: '15', betting: '1,000K', deposit: '200K' },
    { level: 'L3', number: '25', betting: '3.5M', deposit: '700K' },
    { level: 'L4', number: '30', betting: '5M', deposit: '1,000K' },
    { level: 'L5', number: '50', betting: '10M', deposit: '2M' },
    { level: 'L6', number: '100', betting: '100M', deposit: '20M' },
    { level: 'L7', number: '500', betting: '500M', deposit: '100M' },
    { level: 'L8', number: '1000', betting: '1,000M', deposit: '200M' },
    { level: 'L9', number: '5000', betting: '1,500M', deposit: '300M' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 font-medium hover:underline"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Promotion Partner Program</h1>
      <p className="text-center text-gray-500 mb-6">This activity is valid for a long time</p>

      {/* Rules Section */}
      <div className="space-y-5">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border-l-8 border-blue-500"
          >
            <h2 className="text-blue-600 font-bold text-lg mb-1">{rule.id}</h2>
            <p className="text-gray-700">{rule.text}</p>
          </div>
        ))}
      </div>

      {/* Rebate Table */}
      <div className="mt-10 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-blue-600 text-xl font-semibold mb-4">Rebate Levels</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm text-gray-700 border border-gray-200">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="p-2 border">Level</th>
                <th className="p-2 border">Team Number</th>
                <th className="p-2 border">Team Betting</th>
                <th className="p-2 border">Team Deposit</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-blue-50">
                  <td className="p-2 border">{row.level}</td>
                  <td className="p-2 border">{row.number}</td>
                  <td className="p-2 border">{row.betting}</td>
                  <td className="p-2 border">{row.deposit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Higher levels unlock better commission rates. Game types may affect the payout percentage.
        </p>
        {/* <button className="mt-3 text-blue-600 underline hover:text-blue-800 font-medium">
          View rebate ratio &gt;&gt;&gt;
        </button> */}
      </div>
    </div>
  );
};

export default InvitationRules;
