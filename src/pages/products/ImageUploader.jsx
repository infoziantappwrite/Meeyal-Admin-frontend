import React, { useState, useEffect } from "react";

const ImageUploader = ({ onImagesChange, clearImages, isimages }) => {
  const [images, setImages] = useState(isimages || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (clearImages) {
      setImages([]);
    }
  }, [clearImages]);

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  const formData = new FormData();
  files.forEach((file) => formData.append("productImages", file));

  setUploading(true);
  try {
    const res = await fetch("http://localhost:5000/api/uploads/images", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json(); // Array of { _id, imageUrl }
    setImages((prev) => [...prev, ...data]);
    onImagesChange((prev) => [...prev, ...data]);
  } catch (error) {
    console.error("Error uploading images:", error);
  }
  setUploading(false);
};

  const removeImage = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/uploads/${id}`, {
        method: "DELETE",
      });

      const updatedImages = images.filter((img) => img._id !== id);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="col-span-2">
      <h3 className="flex items-center text-gray-700 font-semibold">
        Images <span className="text-gray-500 text-sm ml-2">(900×1250 px)</span>
      </h3>

      <div className="flex gap-4 items-center mt-2">
        <label className="border p-2 w-32 h-44 rounded cursor-pointer text-gray-700 flex justify-center items-center border-dashed">
          <input type="file" multiple className="hidden" onChange={handleImageUpload} />
          {uploading ? "Uploading..." : "+ Add Images"}
        </label>

        {images.length > 0 ? (
          images.map((img) => (
            <div key={img._id} className="relative w-32 h-44 border rounded">
              <img src={img.imageUrl} alt="Preview" className="w-full h-full object-cover rounded" />
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
  );
};

export default ImageUploader;
