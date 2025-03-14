import React, { useState,useEffect } from "react";
import { storage, ID } from "../../lib/appwrite"; // Import Appwrite storage

const ImageUploader = ({ onImagesChange ,clearImages,isimages}) => {
  const [images, setImages] = useState(isimages||[]); // Stores uploaded image URLs
  const [uploading, setUploading] = useState(false); // Show loading state
  useEffect(() => {
    if (clearImages) {
        setImages([]); // Clear images when parent requests
    }
  }, [clearImages]);

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true); // Show loading while uploading

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        try {
          // Upload to Appwrite Storage
          const response = await storage.createFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID, // Storage bucket ID
            ID.unique(),
            file
          );

          // Get Public Image URL
          return storage.getFilePreview(import.meta.env.VITE_APPWRITE_BUCKET_ID, response.$id);
        } catch (error) {
          console.error("Error uploading file:", error);
          return null; // Skip failed uploads
        }
      })
    );

    const validImages = uploadedImages.filter((url) => url !== null); // Remove failed uploads

    setImages([...images, ...validImages]); // Update state
    onImagesChange([...images, ...validImages]); // Send URLs to parent
    setUploading(false); // Hide loading state
  };

  // Remove Image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="col-span-2">
      <h3 className="block text-gray-700 font-semibold">Images*</h3>
      <div className="flex gap-4 items-center mt-2">
        {/* Upload Button */}
        <label className="border p-2 w-32 h-32 rounded cursor-pointer text-gray-700 flex justify-center items-center border-dashed">
          <input type="file" multiple className="hidden" onChange={handleImageUpload} />
          {uploading ? "Uploading..." : "+ Add Images"}
        </label>

        {/* Image Previews */}
        <div className="flex gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative w-32 h-32 border rounded">
              <img src={img} alt="Preview" className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
