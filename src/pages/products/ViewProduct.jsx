import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import axios from "axios";

const ViewProduct = ({ product, onClose }) => {
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    if (product.supplierId) {
      const fetchSupplier = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/suppliers/${product.supplierId}`, {
            withCredentials: true,
          });
          setSupplier(res.data);
        } catch (err) {
          console.error("Error fetching supplier details:", err);
        }
      };
      fetchSupplier();
    }
  }, [product.supplierId]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-[700px] shadow-2xl relative">
        {/* Title & Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Product Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            <XCircle />
          </button>
        </div>

        {/* Product Content Layout */}
        <div className="flex gap-6">
          {/* Left: Image */}
          <div className="w-1/3 flex justify-center items-center">
            {product.image ? (
              <img src={product.image} alt={product.productname} className="w-40 h-40 object-cover rounded-lg shadow-md" />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-gray-700 rounded-lg shadow-md">
                No Image
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-2/3 grid grid-cols-2 gap-4 text-md">
            <p><span className="font-semibold">Name:</span> {product.productname}</p>
            <p><span className="font-semibold">Price:</span> ${product.price}</p>
            <p><span className="font-semibold">Category:</span> {product.category}</p>
            <p><span className="font-semibold">Brand:</span> {product.brand}</p>
            <p><span className="font-semibold">stock:</span> {product.stock}</p>
            <p><span className="font-semibold">Unit:</span> {product.unit}</p>
            <p><span className="font-semibold">Added By:</span> {product.addedBy || "unkown"}</p>
            <p><span className="font-semibold">Supplier Price:</span> ${product.supplierPrice}</p>
            <p><span className="font-semibold">Product id:</span> {product.productid}</p>
            <p><span className="font-semibold">Created At:</span> {new Date(product.createdAt).toLocaleString()}</p>

          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-300">{product.description}</p>
          </div>
        )}

        {/* Supplier Details Card */}
        {supplier && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Supplier Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">Name:</span> {supplier.name}</p>
              <p><span className="font-semibold">Email:</span> {supplier.email}</p>
              <p><span className="font-semibold">Phone:</span> {supplier.phone}</p>
              <p><span className="font-semibold">Address:</span> {supplier.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;
