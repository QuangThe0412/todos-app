import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskManagerPage from "./pages/TaskManagerPage";
import NotFoundPage from "./pages/NotFoundPage"; // Import trang 404
import useAuthStore from "./store/authStore";
import "./output.css";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/tasks" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/tasks" /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/tasks"
          element={
            isAuthenticated ? <TaskManagerPage /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<NotFoundPage />} /> {/* Route 404 */}
      </Routes>
    </Router>
  );
}

export default App;
