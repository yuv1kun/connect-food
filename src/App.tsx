
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./pages/SplashScreen";
import UserSelectionScreen from "./pages/UserSelectionScreen";
import RegistrationScreen from "./pages/RegistrationScreen";
import LoginScreen from "./pages/LoginScreen";
import PasswordRecoveryScreen from "./pages/PasswordRecoveryScreen";
import NotFound from "./pages/NotFound";

// Donor Module Screens
import DonorDashboard from "./pages/donor/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";
import LocationPickupDetails from "./pages/donor/LocationPickupDetails";
import DonationReviewSubmit from "./pages/donor/DonationReviewSubmit";
import DonationStatus from "./pages/donor/DonationStatus";
import DonationHistory from "./pages/donor/DonationHistory";
import ImpactDashboard from "./pages/donor/ImpactDashboard";
import DonorProfile from "./pages/donor/DonorProfile";

// NGO Module Screens
import NgoDashboard from "./pages/ngo/NgoDashboard";
import AvailableDonations from "./pages/ngo/AvailableDonations";
import DonationDetails from "./pages/ngo/DonationDetails";
import PickupAssignment from "./pages/ngo/PickupAssignment";
import ActivePickups from "./pages/ngo/ActivePickups";
import DistributionManagement from "./pages/ngo/DistributionManagement";
import AnalyticsReporting from "./pages/ngo/AnalyticsReporting";
import NgoProfile from "./pages/ngo/NgoProfile";

// Delivery Module Screens
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import AvailableDeliveries from "./pages/delivery/AvailableDeliveries";
import DeliveryDetails from "./pages/delivery/DeliveryDetails";
import NavigationScreen from "./pages/delivery/NavigationScreen";
import PickupConfirmation from "./pages/delivery/PickupConfirmation";
import InTransit from "./pages/delivery/InTransit";
import DeliveryConfirmation from "./pages/delivery/DeliveryConfirmation";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import ActiveDeliveries from "./pages/delivery/ActiveDeliveries";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/select-role" element={<UserSelectionScreen />} />
          <Route path="/register" element={<RegistrationScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/recover-password" element={<PasswordRecoveryScreen />} />
          
          {/* Donor Module Routes */}
          <Route
            path="/donor/dashboard"
            element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>}
          />
          <Route
            path="/donor/create-donation"
            element={<ProtectedRoute role="donor"><CreateDonation /></ProtectedRoute>}
          />
          <Route
            path="/donor/location-pickup"
            element={<ProtectedRoute role="donor"><LocationPickupDetails /></ProtectedRoute>}
          />
          <Route
            path="/donor/review-submit"
            element={<ProtectedRoute role="donor"><DonationReviewSubmit /></ProtectedRoute>}
          />
          <Route
            path="/donor/donation-status/:id"
            element={<ProtectedRoute role="donor"><DonationStatus /></ProtectedRoute>}
          />
          <Route
            path="/donor/donation-history"
            element={<ProtectedRoute role="donor"><DonationHistory /></ProtectedRoute>}
          />
          <Route
            path="/donor/impact"
            element={<ProtectedRoute role="donor"><ImpactDashboard /></ProtectedRoute>}
          />
          <Route
            path="/donor/profile"
            element={<ProtectedRoute role="donor"><DonorProfile /></ProtectedRoute>}
          />
          
          {/* NGO Module Routes */}
          <Route
            path="/ngo/dashboard"
            element={<ProtectedRoute role="ngo"><NgoDashboard /></ProtectedRoute>}
          />
          <Route
            path="/ngo/available-donations"
            element={<ProtectedRoute role="ngo"><AvailableDonations /></ProtectedRoute>}
          />
          <Route
            path="/ngo/donation-details/:id"
            element={<ProtectedRoute role="ngo"><DonationDetails /></ProtectedRoute>}
          />
          <Route
            path="/ngo/pickup-assignment/:id"
            element={<ProtectedRoute role="ngo"><PickupAssignment /></ProtectedRoute>}
          />
          <Route
            path="/ngo/active-pickups"
            element={<ProtectedRoute role="ngo"><ActivePickups /></ProtectedRoute>}
          />
          <Route
            path="/ngo/distribution"
            element={<ProtectedRoute role="ngo"><DistributionManagement /></ProtectedRoute>}
          />
          <Route
            path="/ngo/analytics"
            element={<ProtectedRoute role="ngo"><AnalyticsReporting /></ProtectedRoute>}
          />
          <Route
            path="/ngo/profile"
            element={<ProtectedRoute role="ngo"><NgoProfile /></ProtectedRoute>}
          />
          
          {/* Delivery Module Routes */}
          <Route
            path="/delivery/dashboard"
            element={<ProtectedRoute role="delivery"><DeliveryDashboard /></ProtectedRoute>}
          />
          <Route
            path="/delivery/available"
            element={<ProtectedRoute role="delivery"><AvailableDeliveries /></ProtectedRoute>}
          />
          <Route
            path="/delivery/active"
            element={<ProtectedRoute role="delivery"><ActiveDeliveries /></ProtectedRoute>}
          />
          <Route
            path="/delivery/details/:id"
            element={<ProtectedRoute role="delivery"><DeliveryDetails /></ProtectedRoute>}
          />
          <Route
            path="/delivery/navigation/:id"
            element={<ProtectedRoute role="delivery"><NavigationScreen /></ProtectedRoute>}
          />
          <Route
            path="/delivery/pickup-confirmation/:id"
            element={<ProtectedRoute role="delivery"><PickupConfirmation /></ProtectedRoute>}
          />
          <Route
            path="/delivery/in-transit/:id"
            element={<ProtectedRoute role="delivery"><InTransit /></ProtectedRoute>}
          />
          <Route
            path="/delivery/delivery-confirmation/:id"
            element={<ProtectedRoute role="delivery"><DeliveryConfirmation /></ProtectedRoute>}
          />
          <Route
            path="/delivery/history"
            element={<ProtectedRoute role="delivery"><DeliveryHistory /></ProtectedRoute>}
          />
          <Route
            path="/delivery/profile"
            element={<ProtectedRoute role="delivery"><DeliveryProfile /></ProtectedRoute>}
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
