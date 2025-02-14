import './index.css'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";
import LoginForm from "./components/formComponent/loginForm";
import RegisterForm from "./components/formComponent/registerForm";
import Home from "./components/pageComponent/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1">
          {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
          <div className="p-4">
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="/signup" element={<RegisterForm />} />
                  <Route path="*" element={<Navigate to="/login" />} /> {/* ถ้าเข้า path อื่น ให้ redirect ไป login */}
                </>
              ) : (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<Navigate to="/" />} /> {/* ถ้า login แล้วไป path อื่น ให้กลับไปหน้า Home */}
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;



