import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/shared/ScrollToTop";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Properties from "./pages/public/Properties";
import PropertyDetail from "./pages/public/PropertyDetail";
import Gallery from "./pages/public/Gallery";
import Testimonials from "./pages/public/Testimonials";
import Contact from "./pages/public/Contact";

import AdminOverview from "./pages/admin/Overview";
import AdminProperties from "./pages/admin/Properties";
import AdminGallery from "./pages/admin/Gallery";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminLeads from "./pages/admin/Leads";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/Login";
import AdminRoute from "./components/layout/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/level-a" element={<Properties />} />
          <Route path="properties/level-b" element={<Properties />} />
          <Route path="properties/level-c" element={<Properties />} />
          <Route path="properties/:slug" element={<PropertyDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
