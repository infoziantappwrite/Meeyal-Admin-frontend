/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import axios from "axios";

import { XCircle } from "lucide-react";

const EditSupplier = ({ supplier, onClose, onUpdate }) => {
  if (!supplier) return null;
  const [name, setName] = useState(supplier.name || "");
  const [contactPerson, setContactPerson] = useState(supplier.contactPerson || "");
  const [email, setEmail] = useState(supplier.email || "");
  const [phone, setPhone] = useState(supplier.phone);
  const [address, setAddress] = useState(supplier.address || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const updatedSupplier = { name, contactPerson, email, phone, address };

      const res = await axios.put(
        `http://localhost:8000/api/v1/suppliers/update/${supplier._id}`,
        updatedSupplier,
        { withCredentials: true }
      );

      setSuccess("Supplier updated successfully!");
      onUpdate(res.data); // Update parent component
      setTimeout(() => onClose(), 1500); // Close after success
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[500px] lg:w-[600px] shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-6">Edit Supplier</h2>
        {error && <p className="text-red-500 bg-red-200 p-2 rounded-md mb-4 border border-red-500">{error}</p>}
        {success && <p className="text-green-500 bg-green-200 p-2 rounded-md mb-4 border border-green-500">{success}</p>}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
        >
          <XCircle />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
              maxLength={14}
              minLength={10}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-primary hover:bg-hover-gradient-primary p-2 rounded text-white font-semibold"
          >
            Update Supplier
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
