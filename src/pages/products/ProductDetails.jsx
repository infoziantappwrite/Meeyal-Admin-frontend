import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import noimage from "../../assets/image.png"

const ProductDetails = ({ product, onClose }) => {
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
  {(product.productimages?.length > 0 ? product.productimages : [{ imageurl: noimage }]).map((img, index) => (
    <SwiperSlide key={index}>
      <img
        src={img.imageurl} // ✅ Fix: Use img.imageurl instead of img
        alt={`Product ${index + 1}`}
        className="w-auto h-auto object-cover rounded-lg shadow"
      />
    </SwiperSlide>
  ))}
</Swiper>

    </div>

    {/* Right: Product Details with Auto Scroll */}
    <div className="w-2/3 flex flex-col justify-center overflow-y-auto pr-4">
      <h2 className="text-2xl font-bold mb-3">{product.productname}</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Price:</strong> ₹{product.originalprice}</p>
        <p><strong>Discount Price:</strong> ₹{product.discountprice}</p>
        <p><strong>Stock:</strong> {product.stock} units</p>
        <p><strong>Category:</strong> {product.categories?.name || "NA"}</p>
        <p><strong>Subcategory:</strong> {product.subcategories?.name || "NA"}</p>
        <p><strong>Details:</strong> {product.details}</p>
        <p><strong>Created At:</strong> {new Date(product.$createdAt).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(product.$updatedAt).toLocaleString()}</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductDetails;
