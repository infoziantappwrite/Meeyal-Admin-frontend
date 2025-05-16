import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import noimage from "../../assets/image.png";

const ProductDetails = ({ product, onClose }) => {
  console.log("Product Details:", product);
  
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-lg shadow-lg p-6 relative flex gap-6 overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-800 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Left: Image Swiper */}
        <div className="w-1/3">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="rounded-lg"
          >
            {(product.productImages?.length > 0
              ? product.productImages
              : [{ imageUrl: noimage }]
            ).map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img.imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-auto h-auto object-cover rounded-lg shadow"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right: Product Details */}
        <div className="w-2/3 flex flex-col justify-center overflow-y-auto pr-4">
          <h2 className="text-2xl font-bold mb-3">{product.productName}</h2>

          <div className="space-y-2 text-gray-700">
            <p><strong>Original Price:</strong> ₹{product.originalPrice}</p>
            <p><strong>Discounted Price:</strong> ₹{product.discountPrice}</p>
            <p><strong>Stock:</strong> {product.stock} units</p>
            <p><strong>Category:</strong> {product.category?.name || "NA"}</p>
            <p><strong>Status:</strong> {product.status ? product.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "NA"}</p>
            <p><strong>Subcategory:</strong> {product.subCategory?.name || "NA"}</p>
            <p><strong>Details:</strong> {product.details}</p>
            {product.createdAt && (
              <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
            )}
            {product.updatedAt && (
              <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
