import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/student/Dashboard';
import RequestForm from './pages/student/RequestForm';
import MyRequests from './pages/student/MyRequests';
import StaffDashboard from './pages/staff/Dashboard';
import StaffHistory from './pages/staff/History';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRequests from './pages/admin/Requests';
import UserManagement from './pages/admin/UserManagement';
import DetailedAnalytics from './pages/admin/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="new-request" element={<RequestForm />} />
          <Route path="requests" element={<MyRequests />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['STAFF']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="history" element={<StaffHistory />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<DetailedAnalytics />} />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
