import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/Profile"; // مثال لإضافة صفحة Profile

// ⬅️ استيراد ThemeProvider
import { ThemeProvider } from "./context/ThemeContext";
import Welcome from "./pages/Welcome";

// ⬅️ HOC للتحقق من تسجيل الدخول
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // أو الطريقة التي تحفظ بها التوكن
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    // ✅ لف التطبيق كله
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* صفحات تسجيل الدخول والتسجيل */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* صفحات محمية بعد تسجيل الدخول */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Redirect الجذر / إلى Signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* Catch-all لأي Route غير معروف */}
          <Route path="*" element={<Navigate to="/signup" replace />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;