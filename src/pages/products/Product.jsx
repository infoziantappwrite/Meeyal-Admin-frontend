import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { databases, Query, storage } from "../../lib/appwrite";
import noimage from "../../assets/image.png"
import ProductDetails from "./ProductDetails";
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
import axios from "axios";


const Product = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);


  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewProduct, setshowViewProduct] = useState(false);
  const [showEditProduct, setshowEditProduct] = useState(false);
  const itemsPerPage = 7;

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://meeyaladminbackend-production.up.railway.app/api/products");


      let filteredProducts = response.data;

      if (searchQuery) {
        filteredProducts = filteredProducts.filter((prod) =>
          prod.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.subCategory?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginated = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

      setProducts(paginated);
      setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((prodId) => prodId !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedProducts.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const handleDelete = async () => {
    try {
      for (const productId of selectedProducts) {
        await axios.delete(`https://meeyaladminbackend-production.up.railway.app/api/products/${productId}`);
      }
      setShowDeleteConfirm(false);
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, showViewProduct, showEditProduct]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <PackageSearch /> Product Management
        </h1>
        <div className="flex gap-4">
          {selectedProducts.length > 0 && (
            <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md text-white flex items-center gap-2">
              <Trash2 />Delete Selected
            </button>
          )}
          <button onClick={() => navigate("/add-product")} className="bg-primary hover:bg-hover_primary px-4 py-2 rounded-md text-white flex items-center gap-2">
            <Plus /> Add New Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto text-center rounded-lg shadow-md  border border-gray-300">
        <table className="min-w-full bg-white  shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 rounded-t-lg">
            <tr className=" px-4 py-4 ">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedProducts(e.target.checked ? products.map((p) => p._id) : [])
                  }
                  className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                  checked={selectedProducts.length === products.length && products.length > 0}
                />
              </th>
              <th className="px-4 py-4  first:rounded-tl-lg last:rounded-tr-lg">Image</th>
              <th className="px-4 py-3 ">Name</th>
              <th className="px-4 py-3 ">Price</th>
              <th className="px-4 py-3 ">Category</th>
              <th className="px-4 py-3 ">Subcategory</th>
              <th className="px-4 py-3 ">Stock</th>
              <th className="px-4 py-3  last:rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50 border-b last:rounded-b-lg">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(prod._id)}
                      onChange={() => handleSelect(prod._id)}
                      className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 flex justify-center">
                    {prod.productImages?.length > 0 ? (
                      <img
                        src={prod.productImages[0].imageUrl}
                        alt="Product"
                        className="w-13 h-16 object-cover rounded"
                      />
                    ) : (
                      <img src={noimage} alt="Product" className="w-8 h-8 object-cover rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {prod.productName ? (prod.productName.length > 15 ? prod.productName.substring(0, 15) + "..." : prod.productName) : "NA"}
                  </td>

                  <td className="px-4 py-3">₹ {prod.originalPrice}</td>

                  <td className="px-4 py-3">{prod.category?.name || "NA"}</td>

                  <td className="px-4 py-3">{prod.subCategory?.name || "NA"}</td>

                  <td className="px-4 py-3">{prod.stock}</td>
                  <td className="px-4 py-3 flex gap-3 justify-center ">
                    <button className="text-blue-500 hover:text-blue-600" onClick={() => { setSelectedProduct(prod), setshowEditProduct(true) }}>
                      <Edit />
                    </button>

                    <button
                      className="text-green-500 hover:text-green-600"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setshowViewProduct(true);
                      }}
                    >
                      <Eye />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-gray-500 rounded-b-lg">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md">
          <ChevronsLeft />
        </button>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md">
          <ChevronLeft />
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md">
          <ChevronRight />
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md">
          <ChevronsRight />
        </button>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="text-lg">Are you sure you want to delete?</p>
            <div className="flex gap-4 mt-4 justify-center ">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDelete}>Yes</button>
              <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={() => setShowDeleteConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      {selectedProduct && showViewProduct ? (
        <ProductDetails product={selectedProduct} onClose={() => setshowViewProduct(false)} />
      ) : null}
      {selectedProduct && showEditProduct ? (
        <EditProduct product={selectedProduct} onClose={() => setshowEditProduct(false)} />
      ) : null}



    </div>

  );
};

export default Product;
