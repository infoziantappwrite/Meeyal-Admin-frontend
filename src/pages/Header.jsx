/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { account } from '../lib/appwrite';

const Header = ({ isOpen, toggleSidebar, onSearch }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3); // Example unread notifications count
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Set greeting based on time
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    // Fetch user details from Appwrite
    const fetchUserData = async () => {
      try {
        const user = await account.get();
        setUserName(user.name);
        //console.log(user.name)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Logout function using Appwrite
  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Logout user
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="bg-white text-gray-900 px-4 py-5 flex justify-between items-center shadow-md border-b border-gray-300">
      {/* Left: Sidebar Toggle & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
        <span className="text-sm sm:text-base md:text-lg font-medium truncate max-w-[300px]">
          {greeting}, {userName || "User"}!
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-96 max-w-lg flex-grow">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-200 text-gray-900 rounded-md  focus:outline-none focus:ring focus:ring-gray-400"
        />
        <button type="submit" className="absolute right-3 top-2 text-gray-500 hover:text-gray-900">
          <FiSearch size={20} />
        </button>
      </form>

      {/* Right Side: Notification, Profile */}
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer p-2 rounded bg-gray-200 hover:bg-gray-300 transition">
          <FiBell size={20} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            <FiUser size={20} />
            <FiChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg overflow-hidden border border-gray-300">
              <ul className="text-gray-800">
                <li className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                  <FiUser /> Profile
                </li>
                <li
                  className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
