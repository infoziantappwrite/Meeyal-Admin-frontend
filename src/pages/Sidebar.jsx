/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiShoppingCart,
    FiBox,
    FiUsers,
    FiTag, // Offers Icon
    FiGift,
    FiHeadphones,  // Coupons Icon
  } from "react-icons/fi";
  

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`min-h-screen bg-white text-gray-900 shadow-lg transition-all duration-300 flex flex-col border-r border-gray-300 ${
        isOpen ? "w-56" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center pt-5 border-b border-gray-300 pb-3">
        {isOpen ? (
          <img src="/logo.png" alt="Logo" className="h-12" />
        ) : (
          <img src="/logo.png" alt="Icon" className="h-12" />
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="space-y-4">
          <SidebarItem isOpen={isOpen} Icon={FiHome} label="Dashboard" path="/dashboard" />
          <SidebarItem isOpen={isOpen} Icon={FiBox} label="Products" path="/products" />
          <SidebarItem isOpen={isOpen} Icon={FiShoppingCart} label="Orders" path="/orders" />
          <SidebarItem isOpen={isOpen} Icon={FiUsers} label="Customers" path="/customers" />  
          <SidebarItem isOpen={isOpen} Icon={FiTag} label="Offers" path="/offers" />
            <SidebarItem isOpen={isOpen} Icon={FiGift} label="Coupons" path="/coupons" />
            <SidebarItem isOpen={isOpen} Icon={FiHeadphones} label="Customer Support" path="/support" />

        </ul>
      </nav>
    </div>
  );
};

// Sidebar Item Component with Active Link Highlighting
const SidebarItem = ({ Icon, label, isOpen, path }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 ${
        isOpen ? "m-4" : "px-2 m-2"
      } py-3 hover:bg-gray-200 hover:rounded-md cursor-pointer border-l-4 ${
        isActive ? "border-primary bg-gray-200 rounded-r-md" : "border-transparent"
      }`
    }
  >
    <Icon size={20} />
    {isOpen && <span className="text-sm">{label}</span>}
  </NavLink>
);

export default Sidebar;
