import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const API_URL = "http://localhost:5000/";

const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Enable if your API requires credentials (cookies)
});

// Request Interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with SweetAlert2
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      let message = "An error occurred. Please try again.";

      if (status === 401) {
        message = "Unauthorized! Redirecting to login...";
        window.location.href = "/login"; // Redirect to login
      } else if (status === 403) {
        message = "Forbidden! You do not have permission.";
      } else if (status === 500) {
        message = "Server error! Please contact support.";
      }

      // Show SweetAlert2 error message
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonText: "OK",
      });
    }

    return Promise.reject(error);
  }
);

export default http;
