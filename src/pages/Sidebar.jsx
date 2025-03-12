/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FiHome, 
    FiShoppingCart, 
    FiBox, 
    FiUsers, 
    FiBarChart2, 
    FiSettings, 
    FiTruck, 
    FiFileText, 
    FiUser 
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
    return (
        <div className={`min-h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 flex flex-col ${isOpen ? 'w-56' : 'w-20'} border-r border-gray-800`}>
            
            {/* Logo */}
            <div className="flex items-center justify-center pt-5 border-b border-gray-800 pb-3">
                {isOpen ? <img src="/logo.png" alt="Logo" className="h-10" /> : <img src="/icon.png" alt="Icon" className="h-10" />}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow">
                <ul className="space-y-4">
                    <SidebarItem isOpen={isOpen} Icon={FiHome} label="Dashboard" path="/dashboard" />
                    <SidebarItem isOpen={isOpen} Icon={FiFileText} label="Billing" path="/billing" />
                    <SidebarItem isOpen={isOpen} Icon={FiBox} label="Products" path="/products" />
                    <SidebarItem isOpen={isOpen} Icon={FiUsers} label="Customers" path="/customers" />
                    <SidebarItem isOpen={isOpen} Icon={FiTruck} label="Suppliers" path="/suppliers" />
                    {/* <SidebarItem isOpen={isOpen} Icon={FiShoppingCart} label="Orders" path="/orders" /> */}
                    {/* <SidebarItem isOpen={isOpen} Icon={FiUser} label="Employees" path="/employees" /> */}
                    <SidebarItem isOpen={isOpen} Icon={FiBarChart2} label="Reports" path="/reports" />
                    {/* <SidebarItem isOpen={isOpen} Icon={FiSettings} label="Settings" path="/settings" /> */}
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
            `flex items-center gap-4 px-4 ${isOpen ? 'm-4' : 'PX-0 m-2'} py-3 hover:bg-gray-800 hover:rounded-md cursor-pointer border-l-4 ${isActive ? 'border-primary bg-gray-800 rounded-r-md' : 'border-transparent'}`
        }
    >
        <Icon size={20} />
        {isOpen && <span className="text-sm">{label}</span>}
    </NavLink>
);

export default Sidebar;
