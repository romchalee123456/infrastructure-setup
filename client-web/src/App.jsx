import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./layout/navbar";
import LoginForm from "./components/formComponent/loginForm";
import RegisterForm from "./components/formComponent/registerForm";
import Book from "./components/pageComponent/book";
import BookManagement from "./components/formComponent/bookManagement";
import BorrowingForm from "./components/formComponent/borrowingForm";
import MemberManagement from "./components/formComponent/MemberManagement";
import Profile from "./components/pageComponent/Profile";
import HistoryBorrowing from "./components/pageComponent/historyBorrowing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for 'isAuthenticated' status
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [selectedBook, setSelectedBook] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // Store authentication status
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false"); // Clear authentication status
  };

  return (
    <Router>
      <div className="flex">
        <div className="flex-1">
          {isAuthenticated && <Navbar setIsAuthenticated={handleLogout} />}
          <div className="p-4">
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<LoginForm setIsAuthenticated={handleLogin} />} />
                  <Route path="/signup" element={<RegisterForm />} />
                  <Route path="*" element={<Navigate to="/login" />} /> 
                </>
              ) : (
                <>
                  <Route path="/" element={<Book onBookSelect={setSelectedBook} />} />
                  <Route path="/manage-book" element={<BookManagement />} />
                  <Route path="/manage-user" element={<MemberManagement />} />
                  <Route path="/borrow-history" element={<HistoryBorrowing />} />
                  <Route path="/manage-profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>

      {selectedBook && <BorrowingForm book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </Router>
  );
}

export default App;
