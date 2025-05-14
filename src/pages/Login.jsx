import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://meeyaladminbackend-production.up.railway.app/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        // You can store userId in localStorage/sessionStorage if needed
        localStorage.setItem("userId", res.data.userId);
        console.log("Login successful:", res.data);
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg px-6 py-8 shadow-md w-96 border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-24" />
        </div>

        <h2 className="text-gray-900 text-xl font-semibold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-gradient-primary hover:bg-hover-gradient-primary text-white rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
