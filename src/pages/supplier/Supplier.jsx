import React, { useState, useEffect } from "react";
import axios from "axios";
import AddSupplier from "./AddSupplier";
import ViewSupplier from "./ViewSupplier";
import EditSupplier from "./EditSupplier";
import {
    Plus,
    Eye,
    Edit,
    Trash2,
    Truck,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

const Supplier = ({ searchQuery }) => {
    const [Suppliers, setSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteType, setDeleteType] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [showAddSupplier, setShowAddSupplier] = useState(false); // Modal state
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const itemsPerPage = 10;

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/suppliers/all", {
                withCredentials: true,
            });
            let data = res.data;

            // Apply search filter
            if (searchQuery)
                data = data.filter((c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Update total Supplier count
            setTotalSuppliers(data.length);

            // Pagination logic
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            const startIndex = (currentPage - 1) * itemsPerPage;
            setSuppliers(data.slice(startIndex, startIndex + itemsPerPage));
        } catch (err) {
            console.error("Error fetching Suppliers:", err);

        }
    };

    const confirmDelete = (type, target) => {
        setDeleteType(type);
        setDeleteTarget(target);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        try {
            if (deleteType === "single") {
                await axios.delete(
                    `http://localhost:8000/api/v1/suppliers/delete/${deleteTarget}`,
                    { withCredentials: true }
                );
                setSuppliers(Suppliers.filter((cust) => cust._id !== deleteTarget));
            } else if (deleteType === "multiple") {
                await axios.post(
                    "http://localhost:8000/api/v1/suppliers/delete-many",
                    { ids: selectedSuppliers },
                    { withCredentials: true }
                );
                setSuppliers(Suppliers.filter((cust) => !selectedSuppliers.includes(cust._id)));
                setSelectedSuppliers([]);
            }
            setShowConfirmModal(false);
        } catch (err) {
            console.error("Error deleting Supplier(s):", err);
        }
    };

    const handleSelect = (Supplierid) => {
        setSelectedSuppliers((prevSelected) =>
            prevSelected.includes(Supplierid)
                ? prevSelected.filter((id) => id !== Supplierid)
                : [...prevSelected, Supplierid]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSuppliers(Suppliers.map((cust) => cust._id));
        } else {
            setSelectedSuppliers([]);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [currentPage, searchQuery, handleSelectAll]);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Truck /> Supplier Management
                </h1>
                <div className="flex gap-4">
                    <button className="bg-gray-700 px-4 py-2 rounded-md border border-gray-500">
                        Total Suppliers: {totalSuppliers}
                    </button>
                    <button
                        onClick={() => setShowAddSupplier(true)}
                        className="flex items-center gap-2 bg-gradient-primary hover:bg-hover-gradient-primary px-4 py-2 rounded-md"
                    >
                        <Plus /> Add Supplier
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${selectedSuppliers.length > 0
                            ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                            }`}
                        onClick={() => confirmDelete("multiple", null)}
                        disabled={selectedSuppliers.length === 0}
                    >
                        <Trash2 /> Delete Selected
                    </button>
                </div>

            </div>

            {/* Supplier Table */}
            <div className="overflow-x-auto text-center">
                <table className="min-w-full bg-gray-700 rounded-md border border-gray-900 border-collapse overflow-hidden">
                    <thead className="bg-gray-900 text-white  rounded-t-md">
                        <tr className="rounded-md">
                            <th className="px-4 py-3 border-t border-gray-800">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5"
                                    onChange={handleSelectAll}
                                    checked={selectedSuppliers.length === Suppliers.length && Suppliers.length > 0}
                                />
                            </th>
                            <th className="px-4 py-2 border-t border-gray-800">Name</th>
                            <th className="px-4 py-2 border-t border-gray-800">Phone</th>
                            <th className="px-4 py-2 border-t border-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Suppliers.length > 0 ? (
                            Suppliers.map((cust) => (
                                <tr key={cust._id} className="hover:bg-gray-800">
                                    <td className="px-4 py-2 border-t border-gray-800">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5"
                                            checked={selectedSuppliers.includes(cust._id)}
                                            onChange={() => handleSelect(cust._id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-t border-gray-800">{cust.name}</td>
                                    <td className="px-4 py-3 border-t border-gray-800">{cust.phone}</td>
                                    <td className="px-4 py-3 border-t border-gray-800 flex gap-4 justify-center">
                                        <button className="text-blue-500 hover:text-blue-600" onClick={() => {
                                            setSelectedSupplier(cust);
                                            setShowEditModal(true);
                                        }}>
                                            <Edit />
                                        </button>
                                        <button className="text-red-500 hover:text-red-600" onClick={() => confirmDelete("single", cust._id)}>
                                            <Trash2 />
                                        </button>
                                        <button className="text-green-500 hover:text-green-600" onClick={() => {
                                            setSelectedSupplier(cust);
                                            setShowViewModal(true);
                                        }}>
                                            <Eye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4">
                                    No Suppliers found
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
                            {deleteType === "multiple" ? "these Suppliers" : "this Supllier"}?
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

            {showAddSupplier && <AddSupplier onClose={() => setShowAddSupplier(false)} />}
            {showViewModal && selectedSupplier && (
                <ViewSupplier supplier={selectedSupplier} onClose={() => setShowViewModal(false)} />
            )}
            {showEditModal && selectedSupplier && (
        <EditSupplier
          supplier={selectedSupplier}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedSupplier) => {
            setSuppliers(Suppliers.map((s) => (s._id === updatedSupplier._id ? updatedSupplier : s)));
          }}
        />
      )}
        </div>
    );
};

export default Supplier;