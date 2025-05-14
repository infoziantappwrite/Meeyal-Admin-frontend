import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Loader from "./pages/Loader";
import AddProduct from "./pages/products/Addproduct";
import Product from "./pages/products/Product";
import Offers from "./pages/Offers/Offers";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route
            path="/*"
            element={
              <div className="flex bg-gray-100 text-gray-800">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1">
                  <Header isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onSearch={handleSearch} />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/products" element={<Product searchQuery={searchQuery} />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default App;
