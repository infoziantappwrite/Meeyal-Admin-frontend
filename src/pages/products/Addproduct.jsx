import { useState, useEffect } from "react";
import { Plus, Package, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddCategoryAndSubcategory from "./AddCategoryAndSubcategory";
import ViewCategoriesPopup from "./ViewCategoriesPopup";
import ImageUploader from "./ImageUploader";
import gif from "../../assets/icons8-tick.gif";

const AddProduct = () => {
  const navigate = useNavigate();

  // Form fields
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [details, setDetails] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  // Dropdown data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Image & Modal state
  const [images, setImages] = useState([]);
  const [clearImages, setClearImages] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

   const CATEGORIES_API = "https://meeyaladminbackend-production.up.railway.app/api/categories";
  const SUBCATEGORIES_API = "https://meeyaladminbackend-production.up.railway.app/api/subcategories";
  const PRODUCTS_API = "https://meeyaladminbackend-production.up.railway.app/api/products";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_API);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [isPopupOpen, showPopup]);

  const fetchSubcategories = async (categoryId) => {
    setLoadingSubcategories(true);
    try {
      const res = await fetch(`${SUBCATEGORIES_API}/${categoryId}`);
      const data = await res.json();
      setSubcategories(data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
    setLoadingSubcategories(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("productName", productName);
      formData.append("originalPrice", originalPrice);
      formData.append("discountPrice", discountPercent);
      formData.append("details", details);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("status", status);

      // Append image files directly
      images.forEach((img, index) => {
        formData.append("productImages", img.file); // ✅ exact match
      });

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });


      const response = await fetch(PRODUCTS_API, {
        method: "POST",
        body: formData,
      });


      if (!response.ok) throw new Error("Failed to add product");

      setShowSuccess(true);
      setProductName("");
      setOriginalPrice("");
      setDiscountPercent("");
      setDetails("");
      setStock("");
      setCategory("");
      setSubcategory("");
      setStatus("");
      setImages([]);
      setClearImages(true);

      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => setClearImages(false), 500);
      }, 2500);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <Package size={24} /> Add New Product
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <List size={20} /> Manage Categories
          </button>
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-hover_primary"
          >
            <Plus size={16} /> Add Category / Subcategory
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">Product Name*</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Category*</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                fetchSubcategories(e.target.value);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
              disabled={categories.length === 0}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Subcategory*</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
              disabled={loadingSubcategories || subcategories.length === 0}
            >
              <option value="">
                {loadingSubcategories
                  ? "Loading..."
                  : subcategories.length > 0
                    ? "Select Subcategory"
                    : "No subcategories available"}
              </option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Status*</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
            >
              <option value="">Select Status</option>
              <option value="on_sale">On Sale</option>
              <option value="featured">Featured</option>
              <option value="not_deliverable">Not Deliverable</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Stock*</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Price*</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Discount %</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
            />
          </div>

          <div className="col-span-3">
            <label className="block font-semibold text-gray-700">Details*</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
            />
          </div>

          <div className="col-span-3">
            <label className="block font-semibold text-gray-700">Upload Images*</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files).map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                }));
                setImages(files);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
              required
            />

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative border rounded p-1">
                    <img
                      src={img.preview}
                      alt={`preview-${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="col-span-3 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>

      {/* Popups */}
      {showPopup && <AddCategoryAndSubcategory onClose={() => setShowPopup(false)} />}
      {isPopupOpen && <ViewCategoriesPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center animate-fade-in">
            <img src={gif} alt="Success" className="w-16 h-16 mb-2" />
            <h2 className="text-lg font-bold text-green-700">Product Added Successfully</h2>
            <button
              onClick={() => setShowSuccess(false)}
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

export default AddProduct;
