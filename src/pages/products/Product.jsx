import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "./Addproduct";
import ViewProduct from "./ViewProduct";
import EditProduct from "./EditProduct";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Product = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showViewProductModal, setviewProductModal] = useState(false);
  const [showEditProductModal, setEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 10;

  const openAddProductModal = () => setShowAddProductModal(true);
  const closeAddProductModal = () => setShowAddProductModal(false);


  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [filters, setFilters] = useState({ category: "", unit: "" });

  const handleCategoryChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value, // Only one category at a time
    }));
  };

  const handleUnitChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      unit: value, // Only one category at a time
    }));
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/products/all", {
        withCredentials: true,
      });
      let data = res.data;

      const categories = [...new Set(data.map((p) => p.category))];
      const units = [...new Set(data.map((p) => p.unit))];

      setAvailableCategories(categories);
      setAvailableUnits(units);

      // Apply filters
      if (filters.category) {
        data = data.filter((p) => p.category === filters.category);
      }
      if (filters.unit.length > 0) {
        data = data.filter((p) => filters.unit.includes(p.unit));
      }
      if (searchQuery) {
        data = data.filter((p) =>
          p.productname.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setTotalProducts(data.length);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      const startIndex = (currentPage - 1) * itemsPerPage;
      setProducts(data.slice(startIndex, startIndex + itemsPerPage));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters, searchQuery]);



  const confirmDelete = (type, target) => {
    setDeleteType(type);
    setDeleteTarget(target);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteType === "single") {
        await axios.delete(
          `http://localhost:8000/api/v1/products/delete/${deleteTarget}`,
          { withCredentials: true }
        );
        setProducts(products.filter((prod) => prod._id !== deleteTarget));
      } else if (deleteType === "multiple") {
        await axios.post(
          "http://localhost:8000/api/v1/products/delete-many",
          { ids: selectedProducts },
          { withCredentials: true }
        );
        setProducts(products.filter((prod) => !selectedProducts.includes(prod._id)));
        setSelectedProducts([]);
      }
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Error deleting product(s):", err);
    }
  };

  const handleSelect = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((prod) => prod._id));
    } else {
      setSelectedProducts([]);
    }
  };
  const handleProductAdded = () => {
    fetchProducts(); // Refresh product list
    closeAddProductModal(); // Close modal after adding product
  };


  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PackageSearch /> Product Management
        </h1>
        <div className="flex gap-4">


        </div>
        <div className="flex gap-4">
          <button className="bg-gray-700 px-4 py-2 rounded-md border border-gray-500 ">
            Total Products: {totalProducts}
          </button>

          <button
            onClick={openAddProductModal}
            className="flex items-center gap-2 bg-gradient-primary hover:bg-hover-gradient-primary px-4 py-2 rounded-md"
          >
            <Plus /> Add Product
          </button>
          <button
            className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${selectedProducts.length > 0
              ? "bg-red-600 hover:bg-red-700 cursor-pointer"
              : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            onClick={() => confirmDelete("multiple", null)}
            disabled={selectedProducts.length === 0}
          >
            <Trash2 /> Delete Selected
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        {/* Category Filter */}
        <select
          name="category"
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="bg-gray-900 px-4 py-2 rounded-md border border-gray-700"
        >
          <option value="">All Categories</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Unit Filter (Allows Multiple Selections) */}
        <div className="relative">
          <select
            name="unit"
            onChange={(e) => handleUnitChange(e.target.value)}
            className="bg-gray-900 px-4 py-2 rounded-md border border-gray-700"
          >
            <option value="">All Units</option>
            {availableUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>



      {/* Product Table */}
      <div className="overflow-x-auto text-center">
        <table className="min-w-full bg-gray-700 rounded-md border border-gray-900 border-collapse overflow-hidden">
          <thead className="bg-gray-900 text-white rounded-t-md">
            <tr className="rounded-md">
              <th className="px-4 py-3 border-t border-gray-800">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === products.length && products.length > 0}
                />
              </th>
              <th className="px-4 py-2 border-t border-gray-800">Name</th>
              <th className="px-4 py-2 border-t border-gray-800">Price</th>
              <th className="px-4 py-2 border-t border-gray-800">Category</th>
              <th className="px-4 py-2 border-t border-gray-800">Brand</th>
              <th className="px-4 py-2 border-t border-gray-800">stock</th>
              <th className="px-4 py-2 border-t border-gray-800">Unit</th>
              <th className="px-4 py-2 border-t border-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-800 rounded-md">
                  <td className="px-4 py-2 border-t border-gray-800">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={selectedProducts.includes(prod._id)}
                      onChange={() => handleSelect(prod._id)}
                    />
                  </td>
                  <td className="px-4 py-3 border-t border-gray-800">{prod.productname}</td>
                  <td className="px-4 py-3 border-t border-gray-800">{prod.price}</td>
                  <td className="px-4 py-3 border-t border-gray-800">{prod.category}</td>
                  <td className="px-4 py-3 border-t border-gray-800">{prod.brand || "N/A"}</td>
                  <td className="px-4 py-3 border-t border-gray-800">{prod.stock}</td>
                  <td className="px-4 py-3 border-t border-gray-800">{prod.unit || "N/A"}</td>
                  <td className="px-4 py-3 border-t border-gray-800 flex gap-3 justify-center">
                    <button
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setEditProductModal(true);
                      }}
                    >
                      <Edit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 "
                      onClick={() => confirmDelete("single", prod._id)}
                    >
                      <Trash2 />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-600"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setviewProductModal(true);
                      }}
                    >
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4">
                  No products found
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-xl mb-4">
              Are you sure you want to delete{" "}
              {deleteType === "multiple" ? "these products" : "this product"}?
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

      {showAddProductModal && (

        <AddProduct onClose={closeAddProductModal} onAdd={handleProductAdded} />

      )}
      {showViewProductModal && selectedProduct && (
        <ViewProduct product={selectedProduct} onClose={() => setviewProductModal(false)} />
      )}
      {showEditProductModal && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          onClose={() => setEditProductModal(false)}

        />
      )}

    </div>
  );
};

export default Product;
