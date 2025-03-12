import React, { useState, useEffect } from "react";
import axios from "axios";
import { AddCustomer, EditCustomer, ViewCustomer } from "./Custo";
import {
    Plus,
    Eye,
    Edit,
    Trash2,
    Users,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

const Customer = ({ searchQuery }) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteType, setDeleteType] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const itemsPerPage = 10;

    const fetchCustomers = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/customers/all", {
                withCredentials: true,
            });
            let data = res.data;
            
            //console.log(data);
            // Apply search filter
            if (searchQuery)
                data = data.filter((c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Update total customer count
            setTotalCustomers(data.length);

            // Pagination logic
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            const startIndex = (currentPage - 1) * itemsPerPage;
            setCustomers(data.slice(startIndex, startIndex + itemsPerPage));
        } catch (err) {
            console.error("Error fetching customers:", err);
        }
    };

    const confirmDelete = (type, target) => {
        setDeleteType(type);
        setDeleteTarget(target);
        setShowConfirmModal(true);
    };
    //console.log(customers);

    const handleDelete = async () => {
        try {
            if (deleteType === "single") {
                await axios.delete(
                    `http://localhost:8000/api/v1/customers/delete/${deleteTarget}`,
                    { withCredentials: true }
                );
                setCustomers(customers.filter((cust) => cust._id !== deleteTarget));
            } else if (deleteType === "multiple") {
                await axios.post(
                    "http://localhost:8000/api/v1/customers/delete-many",
                    { ids: selectedCustomers },
                    { withCredentials: true }
                );
                setCustomers(customers.filter((cust) => !selectedCustomers.includes(cust._id)));
                setSelectedCustomers([]);
            }
            setShowConfirmModal(false);
        } catch (err) {
            console.error("Error deleting customer(s):", err);
        }
    };

    const handleSelect = (customerid) => {
        setSelectedCustomers((prevSelected) =>
            prevSelected.includes(customerid)
                ? prevSelected.filter((id) => id !== customerid)
                : [...prevSelected, customerid]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomers(customers.map((cust) => cust._id));
        } else {
            setSelectedCustomers([]);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, searchQuery, handleSelectAll]);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users /> Customer Management
                </h1>
                <div className="flex gap-4">
                    <button className="bg-gray-700 px-4 py-2 rounded-md border border-gray-500">
                        Total Customers: {totalCustomers}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-gradient-primary hover:bg-hover-gradient-primary px-4 py-2 rounded-md"
                    >
                        <Plus /> Add Customer
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${selectedCustomers.length > 0
                            ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                            }`}
                        onClick={() => confirmDelete("multiple", null)}
                        disabled={selectedCustomers.length === 0}
                    >
                        <Trash2 /> Delete Selected
                    </button>
                </div>

            </div>

            {/* Customer Table */}
            <div className="overflow-x-auto text-center">
                <table className="min-w-full bg-gray-700 rounded-md border border-gray-900 border-collapse overflow-hidden">
                    <thead className="bg-gray-900 text-white  rounded-t-md">
                        <tr className="rounded-md">
                            <th className="px-4 py-3 border-t border-gray-800">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5"
                                    onChange={handleSelectAll}
                                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                                />
                            </th>
                            <th className="px-4 py-2 border-t border-gray-800">Name</th>
                            <th className="px-4 py-2 border-t border-gray-800">Gender</th>
                            <th className="px-4 py-2 border-t border-gray-800">Phone</th>
                            <th className="px-4 py-2 border-t border-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((cust) => (
                                <tr key={cust._id} className="hover:bg-gray-800">
                                    <td className="px-4 py-2 border-t border-gray-800">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5"
                                            checked={selectedCustomers.includes(cust._id)}
                                            onChange={() => handleSelect(cust._id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-t border-gray-800">{cust.name}</td>
                                    <td className="px-4 py-3 border-t border-gray-800">{cust.gender}</td>
                                    <td className="px-4 py-3 border-t border-gray-800">{cust.phone}</td>
                                    <td className="px-4 py-3 border-t border-gray-800 flex gap-4 justify-center">
                                        <button className="text-blue-500 hover:text-blue-600" onClick={() => { setSelectedCustomer(cust); setShowEditModal(true); }}>
                                            <Edit />
                                        </button>
                                        <button className="text-red-500 hover:text-red-600" onClick={() => confirmDelete("single", cust._id)}>
                                            <Trash2 />
                                        </button>
                                        <button className="text-green-500 hover:text-green-600" onClick={() => { setSelectedCustomer(cust); setShowViewModal(true); }}>
                                            <Eye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4">
                                    No customers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 gap-4">
                {/* First Page Button */}
                <button
                    onClick={() => setCurrentPage(1)}
                    className="bg-gray-900 px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-1 border border-gray-700"
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft size={18} /> First
                </button>

                {/* Previous Page Button */}
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="bg-gray-900 px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-1 border border-gray-700"
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={18} /> Prev
                </button>

                {/* Current Page Info */}
                <span>Page {currentPage} of {totalPages}</span>

                {/* Next Page Button */}
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="bg-gray-900 px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-1 border border-gray-700"
                    disabled={currentPage === totalPages}
                >
                    Next <ChevronRight size={18} />
                </button>

                {/* Last Page Button */}
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="bg-gray-900 px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-1 border border-gray-700"
                    disabled={currentPage === totalPages}
                >
                    Last <ChevronsRight size={18} />
                </button>
            </div>
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg text-center">
                        <p className="text-xl mb-4">
                            Are you sure you want to delete{" "}
                            {deleteType === "multiple" ? "these Customers" : "this Customer"}?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded-md">
                                Yes, Delete
                            </button>
                            <button onClick={() => setShowConfirmModal(false)} className="bg-gray-600 px-4 py-2 rounded-md">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showViewModal && <ViewCustomer customer={selectedCustomer} onClose={() => setShowViewModal(false)} />}
            {showAddModal && <AddCustomer onClose={() => { setShowAddModal(false); fetchCustomers(); }} />}
            {showEditModal && <EditCustomer customer={selectedCustomer} onClose={() => { setShowEditModal(false); fetchCustomers(); }} />}
        </div>
    );
};

export default Customer;