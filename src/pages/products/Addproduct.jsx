import React, { useState, useEffect } from "react";
import axios from "axios";
import { XCircle } from "lucide-react";

const AddProduct = ({ onClose, onAdd }) => {
  const [productData, setProductData] = useState({
    productname: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    supplierPrice: "",
    unit: "",
    image: "",
    supplierId: ""
  });
  const [suppliers, setSuppliers] = useState([]);
  const [otherCategory, setOtherCategory] = useState("");
  const [otherUnit, setOtherUnit] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch supplier data from backend
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/suppliers/all", {
          withCredentials: true,
        });
        //console.log(res.data);

        setSuppliers(res.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  const categories = ["Electronics", "Clothing", "Furniture", "Food", "Other"];
  const units = ["Kg", "Pieces", "Liters"];

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = productData.category === "Other" ? otherCategory : productData.category;
    const finalUnit = productData.unit === "Other" ? otherUnit : productData.unit;

    const newProduct = { ...productData, category: finalCategory, unit: finalUnit, supplierId: productData.supplierId };
    console.log("Submitting product:", newProduct); // Debugging
    try {
      await axios.post("http://localhost:8000/api/v1/products/create", { productData: newProduct }, {
        withCredentials: true,
      });
      setSuccess("Product added successfully");
      setTimeout(() => onAdd(), 1500); // Close after success

    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.response.data.error);
      setTimeout(() => setError(''), 1500); // Close after success
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[700px] shadow-2xl relative">
        {/* Title & Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl"><XCircle></XCircle></button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 bg-red-200 p-2 rounded-md mb-4 border border-red-500">{error}</p>}
        {success && <p className="text-green-500 bg-green-200 p-2 rounded-md mb-4 border border-green-500">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
            <input type="text" name="productname" placeholder="Product Name" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} />

            <input type="number" name="price" placeholder="Price" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} />
            </div>
            <textarea name="description" placeholder="Description"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} />
            <div className="grid grid-cols-2 gap-6">
           

            <input type="number" name="stock" placeholder="stock" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} />

            <select name="category" className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {productData.category === "Other" && (
              <input type="text" placeholder="Enter category" required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
                onChange={(e) => setOtherCategory(e.target.value)} />
            )}

            <input type="text" name="brand" placeholder="Brand"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} required />

            <input type="number" name="supplierPrice" placeholder="Supplier Price"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} required />

            <select name="unit" className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} required>
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>

            {productData.unit === "Other" && (
              <input type="text" placeholder="Enter unit" required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
                onChange={(e) => setOtherUnit(e.target.value)} />
            )}

            <input type="text" name="image" placeholder="Image URL"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange} />

            <select name="supplierId" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
              onChange={handleChange}>
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
              ))}
            </select>
            <button type="submit" className="w-full py-2 px-4 text-md bg-gradient-primary hover:bg-hover-gradient-primary rounded shadow-md">
              Add Product
            </button>
            </div>
          </div>


          {/* Full-width Button */}
          <div className="col-span-1">
            
          </div>
        </form>
      </div>
    </div>


  );
};

export default AddProduct;
