import React, { useState } from "react";
import { databases } from "../../lib/appwrite";
import ImageUploader from "./ImageUploader";
import CategorySelector from "./CategorySelector";
import gif from "../../assets/icons8-tick.gif"

const EditProduct = ({ product, onClose }) => {
  //console.log(product.productimages);
  const [productName, setProductName] = useState(product.productname);
  const [originalPrice, setOriginalPrice] = useState(product.originalprice);
  const [discountPrice, setDiscountPrice] = useState(product.discountprice || "");
  const [stock, setStock] = useState(product.stock);
  const [details, setDetails] = useState(product.details);
  const [images, setImages] = useState(
    product.productimages?.map((img, index) => ({
      id: img.$id, 
      imageurl: img.imageurl || img,
      key: `${img.$id || img.id || img}-${index}` // Ensure uniqueness
    })) || []
  );
  

  const [category, setCategory] = useState(product.categories);
  const [subcategory, setSubcategory] = useState(product.subcategories);
  const [updating, setUpdating] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // State for confirmation popup
  const [showSuccess, setShowSuccess] = useState(false);

  //console.log(images)
  const handleImageChange = (newImages) => {
    setImages(newImages);
    //console.log(images)
  };
  const handleCheck = () => {
    if (
      !productName.trim() ||
      !originalPrice ||
      !stock ||
      !details.trim() ||
      !category ||
      !subcategory ||
      images.length === 0
    ) {
      setErrorMessage("Please fill all required fields!");
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }
    setErrorMessage(""); // Clear error message if everything is valid
    setShowConfirm(true);

  }

  const handleSave = async () => {
    setUpdating(true);

    setErrorMessage("");
    setShowConfirm(false)

    try {
      const productData = {
        productname: productName,
        originalprice: parseFloat(originalPrice),
        discountprice: parseFloat(discountPrice) || 0,
        details,
        stock: parseInt(stock, 10),
        categories: category,
        subcategories: subcategory,
        productimages: images.map(img => img.id),
      };

      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCT_COLLECTION_ID,
        product.$id,
        productData
      );


      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {
        }, 500); // Small delay for fade-out effect
      }, 2500);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("❌ Failed to update product.");
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }

    setUpdating(false); // Close confirmation popup after saving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%]">
        <div className="overflow-y-auto relative max-h-[90%]">
          {/* Close Button */}
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
            ✖
          </button>
          <h2 className="text-xl font-bold text-center">Edit Product</h2>


          {/* Grid Layout */}
          <div className="grid grid-cols-3 gap-4">
            <div className="grid grid-cols-2 col-span-2 gap-4">
              <div>

                <label className="block text-gray-700 font-semibold mt-4 mb-1">Product Name*</label>
                <input type="text" className="border p-2 w-full rounded" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                {!productName.trim() && <p className="text-red-500 text-sm">Product name is required.</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Original Price*</label>
                <input type="number" className="border p-2 w-full rounded" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} required />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Discount Price</label>
                <input type="number" className="border p-2 w-full rounded" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mt-4 mb-1">Stock*</label>
                <input type="number" className="border p-2 w-full rounded" value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
            </div>

            {/* Middle Column - Category Selection */}
            <div>
              <CategorySelector
                onCategoryChange={setCategory}
                onSubcategoryChange={setSubcategory}
                iscategory={category}
                issubcategory={subcategory}
              />
            </div>
          </div>

          {/* Details Field */}
          <div>
            <label className="block font-semibold text-gray-700 mt-4 mb-1">Details*</label>
            <textarea className="border p-2 w-full rounded h-[100px]" value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <ImageUploader onImagesChange={handleImageChange} clearImages={false} isimages={images} />
          </div>

          {/* Success & Error Messages */}

          {errorMessage && <p className="text-red-600  text-center mt-3">{errorMessage}</p>}

          {/* Buttons (Save & Cancel) */}
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

      {/* Confirmation Popup */}
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
            {/* Success GIF Icon */}
            <img src={gif} alt="Success" className="w-16 h-16 mb-2" />

            {/* Success Message */}
            <h2 className="text-lg font-bold text-green-700">Product Updated Successfully</h2>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose(); // Close modal
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
