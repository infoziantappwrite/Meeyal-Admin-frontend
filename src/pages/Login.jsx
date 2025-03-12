/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["authToken"]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auto-login if token is found
  useEffect(() => {
    const token = cookies.authToken;
    if (token) {
      navigate("/dashboard");
    }
  }, [cookies, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/login", { 
        email, 
        password 
      });

      if (response.data.token) {
        setCookie("authToken", response.data.token, { path: "/", secure: true, httpOnly: false });
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring-1 ring-gray-900/5 shadow-xl w-96">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>
        
        {/* Title */}
        <h2 className="text-gray-900 dark:text-white text-xl font-semibold text-center">Login</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="text"
            placeholder="User ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-3 px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
            required
          />

          {/* Submit Button with Gradient */}
          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-lg text-white font-semibold"
            style={{
              backgroundImage: "linear-gradient(to right, rgb(0, 221, 255), rgb(255, 0, 212))",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
