import React from 'react';
import { UserProfile } from "@clerk/clerk-react";
import FooterNavigation from '@/components/FooterNavigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountPage = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex items-center mb-4" style={{
              backgroundColor: "rgb(49 81 181 )",
              padding: "10px 0px",
              borderRadius: "2px"
            }}>
        <Link to="/" className="mr-2">
          <ArrowLeft className="w-6 h-6" />
        </Link>
          <h1 className="text-xl font-bold">
            Account
          </h1>      
      </div>
      <UserProfile />
      {/* footer navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <FooterNavigation />
      </div>
    </div>
  );
};

export default AccountPage;