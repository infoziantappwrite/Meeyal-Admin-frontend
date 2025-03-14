import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useUser } from "./lib/UserContext"; // Import user context
import Loader from "./pages/Loader";
import AddProduct from "./pages/products/Addproduct";
import Product from "./pages/products/Product";

const App = () => {
  const { user, loading } = useUser(); // Get user context
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    //console.log("Searching for:", query);
    // Perform search logic here
  };
  const isAdmin = user?.labels?.includes("admin");
   //console.log(user)

  if (loading) {
    return (
      <Loader></Loader>
    );
  }

  return (
    <>
      {user && isAdmin ? (
        <div className="flex bg-gray-100 text-gray-800">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          {/* Main Content */}
          <div className="flex-1">
            <Header isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onSearch={handleSearch} />
            <Routes>
              <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery}/>} />
              <Route path="/add-product" element={<AddProduct/>} />
              <Route path="/products" element={<Product searchQuery={searchQuery}/>} />              
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
