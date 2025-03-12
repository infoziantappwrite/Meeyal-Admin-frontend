import React, { useState, useEffect } from "react";
import axios from "axios";
import { XCircle } from "lucide-react";

const EditProduct = ({ product, onClose }) => {
  const [productData, setProductData] = useState({ ...product });
  const [suppliers, setSuppliers] = useState([]);
  const [otherCategory, setOtherCategory] = useState("");
  const [otherUnit, setOtherUnit] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch supplier data
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/suppliers/all", {
          withCredentials: true,
        });
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

    const updatedProduct = { ...productData, category: finalCategory, unit: finalUnit };

    try {
      await axios.put(`http://localhost:8000/api/v1/products/update/${product._id}`, { productData: updatedProduct }, {
        withCredentials: true,
      });
      setSuccess("Product updated successfully");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.error || "Failed to update product");
      setTimeout(() => setError(""), 1500);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[700px] shadow-2xl relative">
        {/* Title & Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            <XCircle />
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 bg-red-200 p-2 rounded-md mb-4 border border-red-500">{error}</p>}
        {success && <p className="text-green-500 bg-red-200 p-2 rounded-md mb-4 border border-green-500">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label htmlFor="productname" className="block text-gray-300 mb-1">Product Name</label>
        <input
          type="text"
          id="productname"
          name="productname"
          placeholder="Product Name"
          required
          value={productData.productname}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-gray-300 mb-1">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Price"
          required
          value={productData.price}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        />
      </div>
    </div>

    <div>
      <label htmlFor="description" className="block text-gray-300 mb-1">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Description"
        value={productData.description}
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
        onChange={handleChange}
      />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <label htmlFor="stock" className="block text-gray-300 mb-1">stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          placeholder="stock"
          required
          value={productData.stock}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-gray-300 mb-1">Category</label>
        <select
          id="category"
          name="category"
          required
          value={productData.category}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {productData.category === "Other" && (
        <div>
          <label htmlFor="otherCategory" className="block text-gray-300 mb-1">Other Category</label>
          <input
            type="text"
            id="otherCategory"
            placeholder="Enter category"
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
            onChange={(e) => setOtherCategory(e.target.value)}
          />
        </div>
      )}

      <div>
        <label htmlFor="brand" className="block text-gray-300 mb-1">Brand</label>
        <input
          type="text"
          id="brand"
          name="brand"
          placeholder="Brand"
          required
          value={productData.brand}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="supplierPrice" className="block text-gray-300 mb-1">Supplier Price</label>
        <input
          type="number"
          id="supplierPrice"
          name="supplierPrice"
          placeholder="Supplier Price"
          required
          value={productData.supplierPrice}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="unit" className="block text-gray-300 mb-1">Unit</label>
        <select
          id="unit"
          name="unit"
          required
          value={productData.unit}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        >
          <option value="">Select Unit</option>
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      {productData.unit === "Other" && (
        <div>
          <label htmlFor="otherUnit" className="block text-gray-300 mb-1">Other Unit</label>
          <input
            type="text"
            id="otherUnit"
            placeholder="Enter unit"
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
            onChange={(e) => setOtherUnit(e.target.value)}
          />
        </div>
      )}

      <div>
        <label htmlFor="image" className="block text-gray-300 mb-1">Image URL</label>
        <input
          type="text"
          id="image"
          name="image"
          placeholder="Image URL"
          value={productData.image}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="supplierId" className="block text-gray-300 mb-1">Supplier</label>
        <select
          id="supplierId"
          name="supplierId"
          required
          value={productData.supplierId}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-md"
          onChange={handleChange}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
          
      <button
        type="submit"
        className="w-full py-2 px-4 mt-7 text-md bg-gradient-primary hover:bg-hover-gradient-primary rounded shadow-md"
      >
        Update Product
      </button>
    </div>
  </div>
</form>

      </div>
    </div>
  );
};

export default EditProduct;
