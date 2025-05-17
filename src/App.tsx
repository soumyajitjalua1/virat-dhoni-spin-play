import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CardGame from "./pages/CardGame";
import WheelSpin from "./pages/WheelSpin";
import ComingSoon from "./pages/ComingSoon";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Wallet from "./pages/Wallet";
import PlayerSelection from "./pages/PlayerSelection";
import MobilePopups from "./components/MobilePopups"; // ✅ Import popup component
import GameSection from "@/components/GameSection";
// import PopularGame from "./pages/PopularGames";
import { casinoGames } from "./pages/casinoGames";
import ActivityPage from "./pages/ActivityPage";
import Promotion from "./pages/Promotion";
import InvitationRules from "./pages/InvitationRules";
import CommissionDetails from "./pages/CommissionDetails";
import RebateRatio from "./pages/RebateRatio";
import ActivityAward from "./pages/ActivityAward";
import Rebate from "./pages/Rebate";
import SuperJackpotPage from "./pages/SuperJackpotPage";
import ActivityDetailsPage from "./pages/ActivityDetailsPage";
import PopularGame from "./pages/PopularGames";
import AccountPage from "./pages/AccountPage";
import GuessPlayerGame from "./pages/GuessPlayerGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SignedIn>
          <MobilePopups /> {/* ✅ Show popup for signed-in users */}
        </SignedIn>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/card-game"
            element={
              <>
                <SignedIn>
                  <CardGame />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/popular"
            element={<PopularGame />}
          />
        <Route
          path="/casino"
          element={<GameSection title="Casino Games" games={casinoGames} />}
        />
          <Route
            path="/guess-player-game"
            element={
              <>
                <SignedIn>
                  <GuessPlayerGame />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="/wheel-spin" element={<WheelSpin />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/invitation-rules" element={<InvitationRules />} />
          <Route path="/commission-details" element={<CommissionDetails />} />
          <Route path="/rebate-ratio" element={<RebateRatio />} />
          <Route path="/activity-award" element={<ActivityAward />} />
          <Route path="/rebate" element={<Rebate />} />
          <Route path="/super-jackpot" element={<SuperJackpotPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route
            path="/activity-details/:id"
            element={<ActivityDetailsPage />}
          />
          <Route
            path="/wallet"
            element={
              <>
                <SignedIn>
                  <Wallet />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/player-selection"
            element={
              <>
                <SignedIn>
                  <PlayerSelection />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
