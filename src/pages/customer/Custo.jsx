import React, { useState } from "react";
import axios from "axios";
import { XCircle } from "lucide-react";

const ViewCustomer = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-[600px] shadow-2xl relative max-h-[80vh] overflow-y-auto">
        {/* Title & Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Customer Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            <XCircle />
          </button>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-4 text-md">
          <p><span className="font-semibold">Name:</span> {customer.name}</p>
          <p><span className="font-semibold">Email:</span> {customer.email || "N/A"}</p>
          <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
          <p className="col-span-2"><span className="font-semibold">Address:</span> {customer.address || "N/A"}</p>
          <p><span className="font-semibold">Age:</span> {customer.age || "N/A"}</p>
          <p><span className="font-semibold">Gender:</span> {customer.gender || "N/A"}</p>
          <p><span className="font-semibold">Occupation:</span> {customer.occupation || "N/A"}</p>
          <p><span className="font-semibold">Category:</span> {customer.customerCategory || "N/A"}</p>
          <p className="col-span-2"><span className="font-semibold">Created At:</span> {new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Invoice History */}
        {customer.invoices && customer.invoices.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold border-b pb-2 mb-2">Invoice History</h3>
            <div className="space-y-4">
              {customer.invoices.map((invoice, index) => (
                <div key={invoice._id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-semibold">Invoice {index + 1}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Total Amount:</span> ₹{invoice.totalAmount}</p>
                  <p><span className="font-semibold">Payment Status:</span> {invoice.paymentStatus}</p>

                  {/* Products List */}
                  <div className="mt-2">
                    <p className="font-semibold">Products:</p>
                    <ul className="list-disc pl-5 text-gray-300">
                      {invoice.products.map((product) => (
                        <li key={product._id}>
                          {product.productID?.productname || "Unknown Product"} - 
                          {product.quantity} x ₹{product.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};







const AddCustomer = ({ onClose }) => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    occupation: "",
    customerCategory: "Regular",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/customers/create", customerData, { withCredentials: true });
      setSuccess("Customer added successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add customer.");
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[500px] shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Customer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl"><XCircle /></button>
        </div>
        {error && <p className="text-red-500 bg-red-200 p-2 rounded-md mb-4 border border-red-500">{error}</p>}
        {success && <p className="text-green-500 bg-green-200 p-2 rounded-md mb-4 border border-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          <textarea name="address" placeholder="Address" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />

          <input type="number" name="age" placeholder="Age" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />

          <select name="gender" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input type="text" name="occupation" placeholder="Occupation" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />

          <select name="customerCategory" required className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange}>
            <option value="Regular">Regular</option>
            <option value="Wholesale">Wholesale</option>
            <option value="VIP">VIP</option>
          </select>

          <button type="submit" className="w-full py-2 bg-gradient-primary hover:bg-hover-gradient-primary rounded shadow-md">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};




const EditCustomer = ({ customer, onClose }) => {
  const [customerData, setCustomerData] = useState(customer);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/v1/customers/update/${customer._id}`,
        customerData,
        { withCredentials: true }
      );

      setSuccess("Customer updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update customer.");
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[500px] shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Customer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            <XCircle />
          </button>
        </div>

        {error && <p className="text-red-500 bg-red-200 p-2 rounded-md mb-4 border border-red-500">{error}</p>}
        {success && <p className="text-green-500 bg-green-200 p-2 rounded-md mb-4 border border-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-1">Name</label>
            <input type="text" id="name" name="name" value={customerData.name} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
            <input type="email" id="email" name="email" value={customerData.email} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-1">Phone</label>
            <input type="text" id="phone" name="phone" value={customerData.phone} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-300 mb-1">Address</label>
            <textarea id="address" name="address" value={customerData.address} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="age" className="block text-gray-300 mb-1">Age</label>
            <input type="number" id="age" name="age" value={customerData.age} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="gender" className="block text-gray-300 mb-1">Gender</label>
            <select id="gender" name="gender" value={customerData.gender} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="occupation" className="block text-gray-300 mb-1">Occupation</label>
            <input type="text" id="occupation" name="occupation" value={customerData.occupation} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="customerCategory" className="block text-gray-300 mb-1">Customer Category</label>
            <select id="customerCategory" name="customerCategory" value={customerData.customerCategory} required 
              className="w-full p-2 rounded bg-gray-700 border text-white" onChange={handleChange}>
              <option value="Regular">Regular</option>
              <option value="Wholesale">Wholesale</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <button type="submit" className="w-full py-2 bg-gradient-primary hover:bg-hover-gradient-primary rounded shadow-md">
            Update Customer
          </button>
        </form>
      </div>
    </div>
  );
};



export { ViewCustomer, AddCustomer, EditCustomer };
