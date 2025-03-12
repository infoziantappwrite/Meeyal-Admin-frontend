import React ,{useState}from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './pages/Header';
import Login from './pages/Login';
import { useCookies } from "react-cookie";
import Product from './pages/products/Product';
import Sidebar from './pages/Sidebar';
import Customer from './pages/customer/Customer';
import Supplier from './pages/supplier/Supplier';
import Billing from './pages/Billing';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import ChatBot from './pages/ChatBot';

const App = () => {
  const [cookies] = useCookies(["authToken"]);
  const isAuthenticated = cookies.authToken; // Get authentication status
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  

  const handleSearch = (query) => {
      setSearchQuery(query);
      console.log("Searching for:", query);
      // Perform search logic here
  };
 

  //console.log(isAuthenticated);
  return (
    <>
      {isAuthenticated ? (
        <div className="flex bg-gray-800 text-white">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <ChatBot></ChatBot>
        {/* Main Content */}
        <div className="flex-1">
          <Header isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onSearch={handleSearch} />
          <Routes>
            <Route path="/products" element={<Product searchQuery={searchQuery}></Product>} />
            <Route path="/customers" element={<Customer searchQuery={searchQuery}></Customer>} />
            <Route path="/suppliers" element={<Supplier searchQuery={searchQuery}></Supplier>} />
            <Route path='/billing' element={<Billing />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/reports' element={<Report />} />
          </Routes>
        </div>
      </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
