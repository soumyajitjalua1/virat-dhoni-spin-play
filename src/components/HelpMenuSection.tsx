import React, { useState } from "react";
import {
  Globe,
  Megaphone,
  Headphones,
  BookOpen,
  Info,
  Download,
  ChevronLeft
} from "lucide-react";

const HelpMenuSection: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleBack = () => setSelectedSection(null);

  const renderContent = () => {
    switch (selectedSection) {
      // case "Language":
      //   return (
      //     <div className="space-y-2">
      //       <button className="block w-full text-left p-2 rounded hover:bg-gray-200">English</button>
      //       <button className="block w-full text-left p-2 rounded hover:bg-gray-200">हिन्दी</button>
      //     </div>
      //   );
      case "Announcement":
        return (
          <div className="space-y-4">
            <img
              src="https://www.pocket52.com/_ipx/s_2400x1200/images/landing-pages/poker-rules-resized.webp"
              alt="Offer 1"
              className="rounded-md w-full"
            />
            <img
              src="https://i0.wp.com/bonaccordaberdeen.com/wp-content/uploads/2023/01/Game-ready-to-play-504x336-1.webp?fit=504%2C336&ssl=1"
              alt="Offer 2"
              className="rounded-md w-full"
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5LTKfLoNZbT5--GKSG341Dnby18x9cKMtTA&s"
              alt="Offer 3"
              className="rounded-md w-full"
            />
          </div>
        );
      case "24/7 Customer service":
        return (
          <div className="space-y-4 text-center">
            <img
              src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg?semt=ais_hybrid&w=740"
              alt="Support"
              className="rounded mx-auto"
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleBack}
            >
              Back to Home
            </button>
          </div>
        );
      case "Beginner's Guide":
        return (
          <p className="text-sm text-gray-700">
            Welcome to Richbig! In this game, you can explore fair lottery draws,
            enjoy blockchain-based casinos, and win big with thousands of slot
            machines. Learn to deposit safely, play smartly, and withdraw your
            winnings quickly. We are here to guide you every step of the way!
          </p>
        );
      case "About us":
        return (
          <div className="text-sm text-gray-700 space-y-2 max-h-96 overflow-y-auto p-2">
            <p>
              This Privacy Policy describes Our policies and procedures on the collection,
              use and disclosure of Your information when You use the Service and tells
              You about Your privacy rights and how the law protects You.
            </p>
            <p>
              <strong>Interpretation and Definitions</strong><br />
              The words with capitalized initials have meanings defined below.
            </p>
            <p><strong>Company</strong> refers to Richbig.</p>
            <p>
              <strong>Affiliate</strong> means an entity that controls, is controlled by or
              is under common control with a party.
            </p>
            <p><strong>Account</strong> means a unique account created for You to access our Service.</p>
            <p><strong>Service</strong> refers to the Website.</p>
            <p><strong>Country</strong> refers to: Delhi, India</p>
            <p><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</p>
            <p><strong>Cookies</strong> are small files stored on Your device by the website.</p>
            <p>
              <strong>Usage Data</strong> includes your IP address, browser type, time on site, and pages visited.
            </p>
            <p>
              We use Cookies to track activity and enhance our Service. You may refuse cookies in your browser.
            </p>
            <p>
              <strong>Children's Privacy:</strong> We do not knowingly collect data from anyone under 13.
            </p>
            <p>
              <strong>Links to Other Websites:</strong> We are not responsible for third-party content.
            </p>
            <p>
              <strong>Changes:</strong> We may update this Policy. Check back periodically for the latest version.
            </p>
            <p>
              <strong>Contact:</strong> Visit the Richbig website for any concerns.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const menuItems = [
    // { label: "Language", icon: <Globe size={20} className="text-blue-500" /> },
    { label: "Announcement", icon: <Megaphone size={20} className="text-blue-500" /> },
    { label: "24/7 Customer service", icon: <Headphones size={20} className="text-blue-500" /> },
    { label: "Beginner's Guide", icon: <BookOpen size={20} className="text-blue-500" /> },
    { label: "About us", icon: <Info size={20} className="text-blue-500" /> },
    // { label: "Download APP", icon: <Download size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 max-w-sm mx-auto space-y-4">
      {selectedSection ? (
        <>
          <button
            className="flex items-center text-sm text-blue-600 mb-2 hover:underline"
            onClick={handleBack}
          >
            <ChevronLeft size={18} /> Back
          </button>
          {renderContent()}
        </>
      ) : (
        menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-2 py-3 rounded hover:bg-gray-100 cursor-pointer transition"
            onClick={() => setSelectedSection(item.label)}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="text-gray-800 font-medium text-sm">{item.label}</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default HelpMenuSection;