import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import THome from "./pages/Home/Teacher/Home";
import NotFound from "./pages/NotFound";
import VerifyFace from "./pages/VerifyFace/VerifyFace";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom";
import Examination from "./pages/Examination/Examination";
import RegisterFace from "./pages/Register/RegisterFace";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import "antd/dist/reset.css";
import useLoad from "./hooks/useLoad";
import Unauthorized from "./pages/Unauthorized";
import ExamRoom from "./pages/Examination/ExamRoom";
import TExamRoom from "./pages/Examination/Teacher/ExamRoom";
import { ExamRoomProvider } from "./context/ExamRoomProvider";
import useNotification from "./hooks/useNotifcation";
import { StudentRoomProvider } from "./context/StudentRoomProvider";
import { TeacherRoomProvider } from "./context/TeacherRoomProvider";

const ROLES = {
  Student: "STUDENT",
  Teacher: "TEACHER",
  Admin: "ADMIN",
};

function App() {
  const { contextHolder } = useLoad();
  const { notifyHolder } = useNotification();
  return (
    <BrowserRouter>
      {contextHolder}
      {notifyHolder}
      <Routes>
        {/* Public routes */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="*"
          element={
            <PublicRoute>
              <NotFound />
            </PublicRoute>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <PublicRoute>
              <Unauthorized />
            </PublicRoute>
          }
        />

        {/* Protected routes */}

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={[ROLES.Student]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={[ROLES.Teacher]}>
              <THome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam-room/:roomId/:userId"
          element={
            <ProtectedRoute allowedRoles={[ROLES.Student]}>
              <ExamRoomProvider>
                <StudentRoomProvider>
                  <ExamRoom />
                </StudentRoomProvider>
              </ExamRoomProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/supervise-room/:roomId/:userId"
          element={
            <ProtectedRoute allowedRoles={[ROLES.Teacher]}>
              <ExamRoomProvider>
                <TeacherRoomProvider>
                  <TExamRoom />
                </TeacherRoomProvider>
              </ExamRoomProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-face/:userId"
          element={
            <ProtectedRoute allowedRoles={[ROLES.Student, ROLES.Teacher]}>
              <RegisterFace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
