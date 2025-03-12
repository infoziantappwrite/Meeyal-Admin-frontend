/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FiUser, FiChevronDown, FiLogOut, FiChevronLeft, FiChevronRight, FiBell, FiSearch } from 'react-icons/fi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Header = ({ isOpen, toggleSidebar, onSearch }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState(3); // Example unread notifications count
    const [, , removeCookie] = useCookies(["authToken"]);
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState("");
    const [cookies] = useCookies(["authToken"]);

    // Logout Function
    const handleLogout = () => {

        removeCookie("authToken"); // Remove from cookies
        navigate("/"); // Redirect to Login Page
    };
    useEffect(() => {
        const hours = new Date().getHours();
        if (hours < 12) {
            setGreeting("Good Morning");
        } else if (hours < 17) {
            setGreeting("Good Afternoon");
        } else {
            setGreeting("Good Evening");
        }
    
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/user/profile", {
                    withCredentials: true, // ✅ Important! Sends cookies with the request
                });
    
               // console.log("User Data:", response.data);
                setUserName(response.data.name);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
    
        fetchUserData();
    }, []);
    


    // Handle Search Submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery); // Pass search query to App.js
        }
    };

    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
            {/* Left: Sidebar Toggle & Greeting */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded bg-gray-700 hover:bg-gray-600">
                    {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
                </button>

                {/* Greeting */}
                <span className="text-sm sm:text-base md:text-lg font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                    {greeting}, {userName || "User"}!
                </span>

            </div>

            {/* Search Bar */}


            {/* Right Side: Notification, Profile */}
            <div className="flex items-center gap-6">
                <form onSubmit={handleSearchSubmit} className="relative w-96 max-w-lg flex-grow">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring focus:ring-gray-600"
                    />
                    <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-white">
                        <FiSearch size={20} />
                    </button>
                </form>

                {/* Notification Icon */}
                <div className="relative cursor-pointer p-2 rounded bg-gray-700 hover:bg-gray-600">
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
                        className="flex items-center gap-2 p-2 rounded bg-gray-700 hover:bg-gray-600">
                        <FiUser size={20} />
                        <FiChevronDown size={16} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg overflow-hidden border border-gray-700">
                            <ul className="text-gray-200">
                                <li className="p-2 hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                    onClick={handleLogout}>
                                    <FiUser /> Profile
                                </li>
                                <li
                                    className="p-2 hover:bg-gray-700 flex items-center gap-2 cursor-pointer text-red-400"
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
