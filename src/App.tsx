
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import Index from "./pages/Index"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import ProductDetail from "./pages/ProductDetail"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"
import Verify from "./pages/Verify"
import NotFound from "./pages/NotFound"
import FAQ from "./pages/FAQ"
import ShippingInfo from "./pages/ShippingInfo"
import Returns from "./pages/Returns"
import SizeGuide from "./pages/SizeGuide"
import HelpCenter from "./pages/HelpCenter"
import TrackOrder from "./pages/TrackOrder"
import PrivacyPolicy from "./pages/PrivacyPolicy"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping-info" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<PrivacyPolicy />} />
            <Route path="/bulk-orders" element={<HelpCenter />} />
            <Route path="/affiliate-program" element={<HelpCenter />} />
            <Route path="/wholesale" element={<HelpCenter />} />
            <Route path="/reviews" element={<HelpCenter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default App
