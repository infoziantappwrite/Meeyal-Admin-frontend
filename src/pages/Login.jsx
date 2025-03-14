import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite"; // Import Appwrite instance
import { useUser } from "../lib/UserContext"; // Import user context
import Loader from "./Loader";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useUser(); // Get user context

  // Show loader while checking session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader></Loader>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        // Authenticate user
        await account.createEmailPasswordSession(email, password);
        
        // Fetch user details
        const user = await account.get(); 
        //console.log(user);
        // Check if the user has the correct role
        if (user?.labels?.includes("admin")) { // Change "admin" to the required role
            await refreshUser(); // Refresh user session after login
            navigate("/dashboard");
        } else {
            setError("Access denied. You do not have permission to log in.");
            await account.deleteSession("current"); // Logout immediately
        }
    } catch (err) {
        setError(err.message || "Login failed. Please try again.");
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg px-6 py-8 shadow-md w-96 border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-24" />
        </div>

        {/* Title */}
        <h2 className="text-gray-900 text-xl font-semibold text-center">Admin Login</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="text"
            placeholder="email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gradient-primary"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gradient-primary"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-primary hover:bg-hover-gradient-primary text-white rounded-lg font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
