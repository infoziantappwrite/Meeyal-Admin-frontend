import React, { useState, useEffect } from "react";
import axios from "axios";
import CategorySelector from "./CategorySelector";
import gif from "../../assets/icons8-tick.gif";
const EditProduct = ({ product, onClose }) => {
  const [productName, setProductName] = useState(product?.productName || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [status, setStatus] = useState(product?.status || "");
  const [details, setDetails] = useState(product?.details || "");
  const [category, setCategory] = useState(product?.category?._id || "");
  const [subcategory, setSubcategory] = useState(product?.subCategory?._id || "");
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [images, setImages] = useState(
    product?.productImages?.map((img, index) => ({
      _id: img._id || img.id || `local-${index}`,
      imageUrl: img.imageUrl || img,
    })) || []
  );
  const [uploading, setUploading] = useState(false);

 const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  const formData = new FormData();
  files.forEach((file) => formData.append("productImages", file));

  setUploading(true);
  try {
    const res = await fetch(`https://meeyaladminbackend-production.up.railway.app/api/products/${product._id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    // Update images state with the latest list of productImages
    setImages(
      data.productImages.map((img) => ({
        _id: img._id,
        imageUrl: img.imageUrl,
      }))
    );
  } catch (error) {
    console.error("Error uploading images:", error);
  }
  setUploading(false);
};


  const removeImage = async (id) => {
    try {
      await fetch(`https://meeyaladminbackend-production.up.railway.app/api/uploads/${id}`, {
        method: "DELETE",
      });
      const updatedImages = images.filter((img) => img._id !== id);
      setImages(updatedImages);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCheck = () => {
    if (
      !productName.trim() ||
      !originalPrice ||
      !details.trim() ||
      !category ||
      !subcategory ||
      !status
    ) {
      setErrorMessage("Please fill all required fields!");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    setErrorMessage("");
    setShowConfirm(true);
  };

const handleSave = async () => {
  setUpdating(true);
  setShowConfirm(false);
  setErrorMessage("");

  try {
    const formData = new FormData();
    formData.append("productName", productName.trim());
    formData.append("originalPrice", parseFloat(originalPrice));
    formData.append("discountPrice", parseFloat(discountPrice) || 0);
    formData.append("details", details.trim());
    formData.append("stock", parseInt(stock, 10));
    formData.append("category", category);
    formData.append("subCategory", subcategory);
    formData.append("status", status);
    images.forEach((imgId) => formData.append("productImages", imgId._id)); // already uploaded images

    const response = await axios.put(
      `https://meeyaladminbackend-production.up.railway.app/api/products/${product._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    setErrorMessage("❌ Failed to update product.");
    setTimeout(() => setErrorMessage(""), 2000);
  }

  setUpdating(false);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] overflow-y-auto relative max-h-[90%]">
        <div className="overflow-y-auto relative max-h-[70%]">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✖
          </button>
          <h2 className="text-xl font-bold text-center">Edit Product</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid grid-cols-2 col-span-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Product Name*</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                {!productName.trim() && (
                  <p className="text-red-500 text-sm">Product name is required.</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Original Price*</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Discount %</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Stock*</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Status*</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="">Select Status</option>
                  <option value="on_sale">On Sale</option>
                  <option value="featured">Featured</option>
                  <option value="not_deliverable">Not Deliverable</option>
                </select>
              </div>
            </div>

            <div>
              <CategorySelector
                onCategoryChange={setCategory}
                onSubcategoryChange={setSubcategory}
                iscategory={category}
                issubcategory={subcategory}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mt-4 mb-1">Details*</label>
            <textarea
              className="border p-2 w-full rounded h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="col-span-2 mt-4">
            <h3 className="flex items-center text-gray-700 font-semibold">
              Images <span className="text-gray-500 text-sm ml-2">(900×1250 px)</span>
            </h3>
            <div className="flex gap-4 items-center mt-2 flex-wrap">
              <label className="border p-2 w-32 h-44 rounded cursor-pointer text-gray-700 flex justify-center items-center border-dashed">
                <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                {uploading ? "Uploading..." : "+ Add Images"}
              </label>

              {images.length > 0 ? (
                images.map((img) => (
                  <div key={img._id} className="relative w-32 h-44 border rounded">
                    <img
                      src={img.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img._id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No images available.</p>
              )}
            </div>
          </div>

          {errorMessage && <p className="text-red-600 text-center mt-3">{errorMessage}</p>}

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button onClick={handleCheck} className="bg-green-500 text-white px-4 py-2 rounded-md">
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <h3 className="text-lg font-bold">Confirm Save</h3>
            <p className="mt-2 text-gray-600">Are you sure you want to save the changes?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setShowConfirm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md">
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center animate-fade-in">
            <img src={gif} alt="Success" className="w-16 h-16 mb-2" />
            <h2 className="text-lg font-bold text-green-700">Product Updated Successfully</h2>
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md w-40"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;