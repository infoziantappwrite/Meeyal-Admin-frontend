import React, { useState } from "react";
import axios from "axios";
import { XCircle } from "lucide-react";

const AddSupplier = ({ onClose }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState(""); // Optional
    const [address, setAddress] = useState(""); // New field
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!name.trim() || !phone.trim() || !address.trim()) {
            setError("Name, phone, and address are required.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/suppliers/create",
                { name, phone, email, address },
                { withCredentials: true }
            );
            if (res.status === 201) {
                setSuccess("Supplier added successfully!");
                setName("");
                setPhone("");
                setEmail("");
                setAddress("");
            }
            setTimeout(() => onClose(), 1500); // Close after success
        } catch (err) {
            setError(err.response.data.error);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 text-white p-8 rounded-lg w-[500px] shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Supplier</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Error & Success Messages */}
                {error && <div className="text-red-500 bg-red-200 p-2 rounded-md mb-4 border border-red-500">{error}</div>}
                {success && <div className="text-green-500 bg-green-200 p-2 rounded-md mb-4 border border-green-500">{success}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Supplier Name"
                        className="p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email (Optional)"
                        className="p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        placeholder="Address"
                        className="p-2 h-20 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none resize-none"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white ${
                            loading ? "bg-gray-600" : "bg-gradient-primary hover:bg-hover-gradient-primary"
                        }`}
                    >
                        {loading ? "Adding..." : "Add Supplier"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSupplier;
