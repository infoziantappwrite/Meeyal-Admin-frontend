import React, { useState, useEffect } from "react";
import { storage, ID, databases, Query } from "../../lib/appwrite"; // Import Appwrite SDK

const ImageUploader = ({ onImagesChange, clearImages, isimages }) => {
  const [images, setImages] = useState(isimages||[]);
  const [uploading, setUploading] = useState(false);
  //console.log(isimages);

  useEffect(() => {
    if (clearImages) {
      setImages([]);
    }
  }, [clearImages]);

  // ✅ Handle Image Upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        try {
          const response = await storage.createFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            ID.unique(),
            file
          );

          const imageUrl = storage.getFilePreview(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            response.$id
          );

          const dbResponse = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_PRODUCTIMAGES_COLLECTION_ID,
            response.$id,
            { imageurl: imageUrl }
          );

          return { id: dbResponse.$id, imageurl: imageUrl };
        } catch (error) {
          console.error("Error uploading file:", error);
          return null;
        }
      })
    );

    const validImages = uploadedImages.filter((img) => img !== null);

    // ✅ Merge newly uploaded images with existing ones
    setImages((prev) => [...prev, ...validImages]);
    onImagesChange((prev) => [...prev, ...validImages]);
    //console.log(images);
    setUploading(false);
  };

  // ✅ Remove Image
  const removeImage = async (id) => {
    try {
      await storage.deleteFile(import.meta.env.VITE_APPWRITE_BUCKET_ID, id);
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTIMAGES_COLLECTION_ID,
        id
      );

      const updatedImages = images.filter((img) => img.id !== id);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  //console.log(images)

  return (
    <div className="col-span-2">
      <h3 className="flex items-center text-gray-700 font-semibold">
        Images <span className="text-gray-500 text-sm ml-2">(900×1250 px)</span>
      </h3>

      <div className="flex gap-4 items-center mt-2">
        {/* Upload Button */}
        <label className="border p-2 w-32 h-44 rounded cursor-pointer text-gray-700 flex justify-center items-center border-dashed">
          <input type="file" multiple className="hidden" onChange={handleImageUpload} />
          {uploading ? "Uploading..." : "+ Add Images"}
        </label>

        {images.length > 0 ? (
          images.map((img) => (
            <div key={img.id} className="relative w-32 h-44 border rounded">
              <img src={img.imageurl} alt="Preview" className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
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
  );
};

export default ImageUploader;
