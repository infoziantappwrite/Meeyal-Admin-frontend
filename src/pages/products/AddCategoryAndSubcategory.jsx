import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddCategoryAndSubcategory = ({ onClose }) => {
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const addCategory = async () => {
    try {
      await axios.post("http://localhost:5000/api/categories", { name: newCategory });
      setSuccessMessage("Category added successfully!");
      setNewCategory("");
      fetchCategories();
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      setErrorMessage("Failed to add category.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const addSubcategory = async () => {
    if (!selectedCategory) {
      setErrorMessage("Please select a category for the subcategory.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/subcategories", {
        name: newSubcategory,
        category: selectedCategory,
      });
      setSuccessMessage("Subcategory added successfully!");
      setNewSubcategory("");
      autoClosePopup();
    } catch (err) {
      setErrorMessage("Failed to add subcategory.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const autoClosePopup = () => {
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Category & Subcategory</h2>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="mb-6">
          <h3 className="text-lg mb-2 text-gray-700">Add Category</h3>
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={addCategory} className="bg-green-500 text-white p-2 rounded mt-2 w-full hover:bg-green-600">
            Add Category
          </button>
        </div>

        <div>
          <h3 className="text-lg mb-2 text-gray-700">Add Subcategory</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter subcategory name"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={addSubcategory} className="bg-blue-500 text-white p-2 rounded mt-2 w-full hover:bg-blue-600">
            Add Subcategory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryAndSubcategory;
