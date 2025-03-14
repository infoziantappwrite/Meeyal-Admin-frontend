import React, { useState, useEffect } from "react";
import { databases } from "../../lib/appwrite"; // Ensure this is correctly imported
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
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CATA_COLLECTION_ID
      );
      setCategories(response.documents);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Add Category
  const addCategory = async () => {
    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CATA_COLLECTION_ID,
        "unique()",
        { name: newCategory }
      );
      setSuccessMessage("Category added successfully!");
      setNewCategory("");
      fetchCategories();
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setErrorMessage("Failed to add category.");
      
      console.error("Error adding category:", err);
    }
  };

  // Add Subcategory
  const addSubcategory = async () => {
    if (!selectedCategory) {
      setErrorMessage("Please select a category for the subcategory.");
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }
    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_SUBCATA_COLLECTION_ID,
        "unique()",
        { name: newSubcategory, categories: selectedCategory }
      );
      setSuccessMessage("Subcategory added successfully!");
      setNewSubcategory("");
      autoClosePopup();
    } catch (err) {
      setErrorMessage("Failed to add subcategory.");
      setTimeout(() => {
        setErrorMessage('');
      }, 1500);
      console.error("Error adding subcategory:", err);
    }
  };

  // Auto close the popup after 1.5 seconds
  const autoClosePopup = () => {
   setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96 relative">
        {/* Close Button - Rounded Circle */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 border text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Category & Subcategory</h2>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Add Category */}
        <div className="mb-6">
          <h3 className="text-lg mb-2 text-gray-700">Add Category</h3>
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button onClick={addCategory} className="bg-green-500 text-white p-2 rounded mt-2 w-full hover:bg-green-600 transition">
            Add Category
          </button>
        </div>

        {/* Add Subcategory */}
        <div>
          <h3 className="text-lg mb-2 text-gray-700">Add Subcategory</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 text-gray-700 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            disabled={categories.length === 0}
          >
            {categories.length > 0 ? (
                <>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.$id} value={cat.$id}>
                      {cat.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No categories available add new one</option>
              )}
          </select>

          <input
            type="text"
            placeholder="Enter subcategory name"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="w-full p-2 text-gray-700 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={addSubcategory} className="bg-blue-500 text-white p-2 rounded mt-2 w-full hover:bg-blue-600 transition">
            Add Subcategory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryAndSubcategory;
