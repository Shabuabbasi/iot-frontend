import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import Signup from "../pages/auth/Signup";
import Forget from "../pages/auth/forget";
import OtpScreen from "../pages/auth/otpScreen";
import CollectorLayout from "../layouts/CollectorLayout";
import CollectorDashboard from "../pages/dashboard/collectorDashboard/CollectorDashboard";
import Tasks from "../pages/dashboard/collectorDashboard/Tasks";
import Reports from "../pages/dashboard/collectorDashboard/Reports";
import Profile from "../pages/dashboard/collectorDashboard/Profile";
import Attendance from "../pages/dashboard/collectorDashboard/Attendance";
import BinCollection from "../pages/dashboard/collectorDashboard/BinCollection";
import UploadProofs from "../pages/dashboard/collectorDashboard/UploadProofs";
import AdminDashboard from "../pages/dashboard/adminDashboard/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import TasksManagement from "../pages/dashboard/adminDashboard/TasksManagement";
import CollectorsManagement from "../pages/dashboard/adminDashboard/CollectorsManagement";
import VehicleManagement from "../pages/dashboard/adminDashboard/VehicleManagement";
import BinManagement from "../pages/dashboard/adminDashboard/BinManagement";
import AdminReports from "../pages/dashboard/adminDashboard/AdminReports";
import RoutesMap from "../pages/dashboard/adminDashboard/RoutesMap";
import RealTimeMonitoring from "../pages/dashboard/adminDashboard/RealTimeMonitoring";
import CustomerSupport from "../pages/dashboard/adminDashboard/CustomerSupport";
import Works from "../pages/homePage/works";
import Features from "../pages/homePage/feature";
import Services from "../pages/homePage/service";
import Awareness from "../pages/homePage/awarenessCommunity";
import Contact from "../pages/homePage/contact";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<Works />} />
          <Route path="/features" element={<Features />} />
          <Route path="/services" element={<Services />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/otp-Screen" element={<OtpScreen />} />

        <Route 
          path="/Collector-Dashboard" 
          element={
            <ProtectedRoute allowedRole="collector">
              <CollectorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CollectorDashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="bin-collections" element={<BinCollection />} />
          <Route path="collectors-routes" element={<RoutesMap />} />
          <Route path="upload-proof" element={<UploadProofs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route 
          path="/Admin-Dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tasks-management" element={<TasksManagement />} />
          <Route path="collectors-management" element={<CollectorsManagement />} />
          <Route path="vehicle-management" element={<VehicleManagement />} />
          <Route path="bin-management" element={<BinManagement />} />
          <Route path="real-time-monitoring" element={<RealTimeMonitoring />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="routes-map" element={<RoutesMap />} />
          <Route path="customer-support" element={<CustomerSupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
