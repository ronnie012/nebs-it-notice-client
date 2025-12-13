import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import CreateNotice from "./pages/CreateNotice";
import EditNotice from "./pages/EditNotice";

// Dummy Pages for Sidebar Navigation
import DashboardPage from "./pages/dummy/DashboardPage";
import EmployeeDatabasePage from "./pages/dummy/EmployeeDatabasePage";
import AddNewEmployeePage from "./pages/dummy/AddNewEmployeePage";
import PerformanceReportPage from "./pages/dummy/PerformanceReportPage";
import PerformanceHistoryPage from "./pages/dummy/PerformanceHistoryPage";
import PayrollPage from "./pages/dummy/PayrollPage";
import PayslipPage from "./pages/dummy/PayslipPage";
import AttendancePage from "./pages/dummy/AttendancePage";
import RequestCenterPage from "./pages/dummy/RequestCenterPage";
import CareerJobsPage from "./pages/dummy/CareerJobsPage";
import CareerApplicantsPage from "./pages/dummy/CareerApplicantsPage";
import DocumentManagerPage from "./pages/dummy/DocumentManagerPage";
import NoticeBoardContentPage from "./pages/dummy/NoticeBoardPage"; // Renamed import from dummy folder


import ActivityLogPage from "./pages/dummy/ActivityLogPage";
import ExitInterviewPage from "./pages/dummy/ExitInterviewPage";
import ProfilePage from "./pages/dummy/ProfilePage";


export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Employee Tab Routes */}
          <Route path="/employee/database" element={<EmployeeDatabasePage />} />
          <Route path="/employee/add-new" element={<AddNewEmployeePage />} />
          <Route path="/employee/performance-report" element={<PerformanceReportPage />} />
          <Route path="/employee/performance-history" element={<PerformanceHistoryPage />} />

          {/* Payroll Routes */}
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/payslip" element={<PayslipPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/request-center" element={<RequestCenterPage />} />

          {/* Career Database Routes */}
          <Route path="/career/jobs" element={<CareerJobsPage />} />
          <Route path="/career/applicants" element={<CareerApplicantsPage />} />

          {/* Other Main Routes */}
          <Route path="/document-manager" element={<DocumentManagerPage />} />
          <Route path="/notice-board" element={<NoticeBoardContentPage />} /> {/* Using content from dummy for comparison */}
          <Route path="/activity-log" element={<ActivityLogPage />} />
          <Route path="/exit-interview" element={<ExitInterviewPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Original Notice Management Specific Routes */}
          <Route path="/create-notice" element={<CreateNotice />} />
          <Route path="/edit-notice/:id" element={<EditNotice />} />

          {/* Optional: Add a 404 Not Found Page */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}