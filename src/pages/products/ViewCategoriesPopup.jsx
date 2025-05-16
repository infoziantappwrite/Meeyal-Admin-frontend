import React, { useState, useEffect } from "react";
import { Edit, Trash2, X, Check } from "lucide-react";

const ViewCategoriesPopup = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null, type: "" });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchSubcategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://meeyaladminbackend-production.up.railway.app/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("https://meeyaladminbackend-production.up.railway.app/api/subcategories");
      const data = await res.json();
      setSubcategories(data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleEdit = (id, name) => {
    setEditing(id);
    setUpdatedName(name);
  };

  const handleUpdate = async (id, type) => {
    try {
      const endpoint = type === "category" ? `https://meeyaladminbackend-production.up.railway.app/api/categories/${id}` : `https://meeyaladminbackend-production.up.railway.app/api/subcategories/${id}`;
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName }),
      });

      setEditing(null);
      fetchCategories();
      fetchSubcategories();
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const confirmDelete = (id, type) => {
    setDeletePopup({ show: true, id, type });
  };

  const handleDelete = async () => {
    try {
      const endpoint = deletePopup.type === "category"
        ? `https://meeyaladminbackend-production.up.railway.app/api/categories/${deletePopup.id}`
        : `https://meeyaladminbackend-production.up.railway.app/api/subcategories/${deletePopup.id}`;
      await fetch(endpoint, { method: "DELETE" });

      setDeletePopup({ show: false, id: null, type: "" });
      fetchCategories();
      fetchSubcategories();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Categories & Subcategories</h2>

        {/* Categories List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-2 border-b">
                {editing === cat._id ? (
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  <span className="text-gray-800">{cat.name}</span>
                )}

                <div className="flex gap-2">
                  {editing === cat._id ? (
                    <button onClick={() => handleUpdate(cat._id, "category")} className="text-green-500">
                      <Check />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(cat._id, cat.name)} className="text-blue-500">
                      <Edit />
                    </button>
                  )}
                  <button onClick={() => confirmDelete(cat._id, "category")} className="text-red-500">
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Subcategories List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Subcategories</h3>
          {subcategories.length === 0 ? (
            <p className="text-gray-500">No subcategories found.</p>
          ) : (
            subcategories.map((sub) => (
              <div key={sub._id} className="flex items-center justify-between p-2 border-b">
                {editing === sub._id ? (
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  <span className="text-gray-800">{sub.name}</span>
                )}

                <div className="flex gap-2">
                  {editing === sub._id ? (
                    <button onClick={() => handleUpdate(sub._id, "subcategory")} className="text-green-500">
                      <Check />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(sub._id, sub.name)} className="text-blue-500">
                      <Edit />
                    </button>
                  )}
                  <button onClick={() => confirmDelete(sub._id, "subcategory")} className="text-red-500">
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Popup */}
        {deletePopup.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={() => setDeletePopup({ show: false, id: null, type: "" })}
                className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h2>
              <p className="text-gray-600">Are you sure you want to delete this {deletePopup.type}?</p>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setDeletePopup({ show: false, id: null, type: "" })} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCategoriesPopup;
