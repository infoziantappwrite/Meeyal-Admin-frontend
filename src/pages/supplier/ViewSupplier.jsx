import React from "react";
import { XCircle } from "lucide-react";

const ViewSupplier = ({ supplier, onClose }) => {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[500px] lg:w-[600px] shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-6">Supplier Details</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
        >
         <XCircle>   </XCircle> 
        </button>

        <div className="space-y-4 text-lg">
          <p><strong>Name:</strong> {supplier.name || "N/A"}</p>
          <p><strong>Contact Person:</strong> {supplier.contactPerson || "N/A"}</p>
          <p><strong>Email:</strong> {supplier.email || "N/A"}</p>
          <p><strong>Phone:</strong> {supplier.phone || "N/A"}</p>
          <p><strong>Address:</strong> {supplier.address || "N/A"}</p>
          <p><strong>Created At:</strong> {new Date(supplier.createdAt).toLocaleString()}</p>

          {/* Scrollable Products Supplied Section */}
          <div>
            <strong>Products Supplied:</strong>
            {supplier.productsSupplied?.length > 0 ? (
              <div className="mt-2 bg-gray-700 p-3 rounded-md max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {supplier.productsSupplied.map((product, index) => (
                    <li key={index} className="border-b border-gray-600 pb-2 last:border-none">
                      <p><strong>Name:</strong> {product.productname || "N/A"}</p>
                      <p><strong>Category:</strong> {product.category || "N/A"}</p>
                      <p><strong>Price:</strong> ₹{product.price?.toFixed(2) || "N/A"}</p>
                      <p><strong>ProductID:</strong> {product.productid|| "N/A"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2">No products supplied</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSupplier;
