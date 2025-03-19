import { useState, useEffect } from "react";
import { databases } from "../../lib/appwrite";
import { ID } from "appwrite";
import { Plus, Package, List } from "lucide-react"; // Import Lucide icons
import AddCategoryAndSubcategory from "./AddCategoryAndSubcategory";
import ViewCategoriesPopup from "./ViewCategoriesPopup";
import ImageUploader from "./ImageUploader";
import { useNavigate } from "react-router-dom";
import gif from "../../assets/icons8-tick.gif"

const AddProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [details, setDetails] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clearImages, setClearImages] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_CATA_COLLECTION_ID
        );
        setCategories(response.documents);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [isPopupOpen, showPopup]);

  const fetchSubcategories = async (categoryId) => {
    setLoadingSubcategories(true);
    try {
      const res = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_SUBCATA_COLLECTION_ID,

      );
      const filteredSubcategories = res.documents.filter(sub => sub.categories.$id === categoryId);
      setSubcategories(filteredSubcategories);
      //setSubcategories(res.documents);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
    setLoadingSubcategories(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert values to correct data types
      const productData = {
        productname: productName,
        originalprice: parseFloat(originalPrice),
        discountprice: parseFloat(discountPrice),
        details,
        stock: parseInt(stock, 10),
        categories: category,
        subcategories: subcategory,
        productimages: images.map(img => img.id), // Array of URLs
        status: status,
      };
      //console.log(productData)

      // Save to Appwrite database
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCT_COLLECTION_ID,
        ID.unique(),
        productData
      );

      setShowSuccess(true);


      //console.log("Product added:", productData);

      // Reset form fields after successful submission
      setProductName("");
      setOriginalPrice("");

      setDetails("");
      setStock("");
      setCategory("");
      setSubcategory("");
      setStatus("");
      setImages([]);
      setDiscountPrice('');
      setClearImages(true);
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {

          setClearImages(false);
        }, 500); // Small delay for fade-out effect
      }, 2500);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };


  return (
    <div className="p-4">
      {/* Header with Add Category & Add Subcategory */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          < Package size={24}></Package> Add New Product
        </h2>
        {/* Success Message with Fade Effect */}

        <div className="flex gap-4">

          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <List size={20} /> Manage Categories
          </button>
          <button className="bg-primary border  px-4 py-2  hover:bg-hover_primary  text-white rounded-md flex items-center gap-2" onClick={() => setShowPopup(true)}>
            <Plus size={16} /> Add Category / Subcategory
          </button>
          {/* <button className="bg-green-500 text-white p-2 rounded-md flex items-center gap-2">
            <Plus size={16} /> Add New Subcategory
          </button> */}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 ">
          {/* Left Column */}
          <div>
            <label className="block text-gray-700 font-semibold">Product Name*</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 border rounded text-gray-800  focus:ring-gray-400 focus:outline-none focus:ring-2 "
              required
            />
          </div>


          <div>
            <label className="block text-gray-700 font-semibold">Category*</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value), fetchSubcategories(e.target.value) }}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
              disabled={categories.length === 0}
            >
              {categories.length > 0 ? (
                <>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.$id} value={cat.$id}>
                      {cat.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No categories available add new one</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Subcategory*</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
              disabled={loadingSubcategories || subcategories.length === 0} // Disable if loading or empty
            >
              <option value="">
                {loadingSubcategories ? "Loading..." : subcategories.length > 0 ? "Select Subcategory" : "No subcategories available"}
              </option>
              {subcategories.length > 0 &&
                subcategories.map((sub) => (
                  <option key={sub.$id} value={sub.$id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Status*</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="">Select Status</option>
              <option value="on_sale">On Sale</option>
              <option value="featured">Featured</option>
              <option value="not_deliverable">Not Deliverable</option>
            
            </select>
          </div>


          <div>
            <label className="block text-gray-700 font-semibold">Stock*</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>


          <div>
            <label className="block text-gray-700 font-semibold">Price*</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Discount %</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>



          <div className="col-span-3">
            <label className="block text-gray-700 font-semibold">Details*</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <ImageUploader onImagesChange={setImages} clearImages={clearImages} />

          <div className="col-span-3 flex justify-end gap-4">
            <button type="button" onClick={() => navigate("/products")} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button type="submit" className="text-white px-4 py-2 rounded-md bg-green-500 border  hover:bg-green-700">
              Confirm
            </button>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="text-lg font-semibold mb-4 text-gray-800">Are you sure you want to cancel?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowCancelPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">No</button>
              <button onClick={() => setShowCancelPopup(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">Yes</button>
            </div>
          </div>
        </div>
      )}
      {showPopup && <AddCategoryAndSubcategory onClose={() => setShowPopup(false)} />}
      {isPopupOpen && <ViewCategoriesPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center animate-fade-in">
            {/* Success GIF Icon */}
            <img src={gif} alt="Success" className="w-16 h-16 mb-2" />

            {/* Success Message */}
            <h2 className="text-lg font-bold text-green-700">Product Added Successfully</h2>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccess(false);
                // Close modal
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

export default AddProduct;
