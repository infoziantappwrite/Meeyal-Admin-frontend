import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const OfferImages = () => {
  const [MainImages, setMainImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  console.log("MainImages:", MainImages);
  

  const imageSizes = {
    main: { width: 1920, height: 800 },
    offer: { width: 1080, height: 500 },
    category: { width: 1170, height: 250 },
    special: { width: 360, height: 500 },
    newcollection: { width: 360, height: 500 },
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("https://meeyaladminbackend-production.up.railway.app/api/offer");
        const data = await res.json();
      
        const categorized = data.reduce((acc, img) => {
          if (img.tag === "main") {
            if (!acc["main"]) acc["main"] = [];
            acc["main"].push(img);
          } else {
            acc[img.tag] = img;
          }
          return acc;
        }, {});


        setMainImages(categorized);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();
  }, []);

  const validateImageSize = (file, tag) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = imageSizes[tag] || {};
        if (img.width === width && img.height === height) {
          resolve(true);
        } else {
          setUploadStatus({ type: "error", message: `Image must be ${width}x${height}px.` });
          resolve(false);
        }
      };
    });
  };

  const handleImageUpload = async (e, tag) => {
  const file = e.target.files[0];
  if (!file) {
    setUploadStatus({ type: "error", message: "Please select an image." });
    return;
  }

  if (tag !== "main" && MainImages[tag]) {
    setUploadStatus({ type: "error", message: "Only one image allowed for this category." });
    return;
  }

  const isValid = await validateImageSize(file, tag);
  if (!isValid) return;

  setUploading(true);
  setUploadStatus({ type: "loading", message: "Uploading..." });

  try {
    const formData = new FormData();
    formData.append("offerImages", file); // ✅ MUST match Multer's field name
    formData.append("tag", tag);          // ✅ Send tag for backend logic

    const res = await fetch("https://meeyaladminbackend-production.up.railway.app/api/offer", {
      method: "POST",
      body: formData,
    });

    const newImage = await res.json();

    setMainImages((prev) => {
      if (tag === "main") {
        return { ...prev, [tag]: [...(prev[tag] || []), newImage] };
      } else {
        return { ...prev, [tag]: newImage };
      }
    });

    setUploadStatus({ type: "success", message: "Upload successful!" });
  } catch (err) {
    console.error("Upload failed:", err);
    setUploadStatus({ type: "error", message: "Upload failed!" });
  }

  setUploading(false);
  setTimeout(() => setUploadStatus(null), 3000);
};

  const handleDelete = async (id, tag) => {
    try {
      await fetch(`https://meeyaladminbackend-production.up.railway.app/api/offer/${id}`, { method: "DELETE" });

      setMainImages((prev) => {
        if (tag === "main") {
          return { ...prev, [tag]: prev[tag].filter((img) => img._id !== id) };
        } else {
          const copy = { ...prev };
          delete copy[tag];
          return copy;
        }
      });

      setUploadStatus({ type: "success", message: "Image deleted." });
    } catch (err) {
      console.error("Delete failed:", err);
      setUploadStatus({ type: "error", message: "Failed to delete image." });
    }

    setTimeout(() => setUploadStatus(null), 3000);
  };

  const renderUploadSection = (tag, title) => {
    const { width, height } = imageSizes[tag];
    const image = MainImages[tag];

    console.log("Image:", image);
    

    return (
      <div>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-gray-600">Image size: {width} × {height}</p>
          </div>
          {!image ? (
            <>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, tag)} className="hidden" id={`upload-${tag}`} disabled={uploading} />
              <label htmlFor={`upload-${tag}`} className={`cursor-pointer px-6 py-2 rounded-lg text-white font-medium ${uploading ? "bg-gray-400" : "bg-pink-500"} transition duration-300 hover:opacity-90`}>
                Upload
              </label>
            </>
          ) : (
            <button onClick={() => handleDelete(image._id, tag)} className="px-6 py-2 rounded-lg text-white font-medium bg-red-500 hover:opacity-90">
              Delete
            </button>
          )}
        </div>

        {image?.imagesUrl ? (
          <div className="mt-4 flex justify-center">
            <img src={image.imagesUrl} alt={title} className="rounded-lg shadow-md max-h-64 object-cover" />
          </div>
        ) : (
          <div className="mt-6 text-center text-gray-500">No image uploaded yet.</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {uploadStatus && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg
          ${uploadStatus.type === "success" ? "bg-green-600 text-white" : ""}
          ${uploadStatus.type === "error" ? "bg-red-600 text-white" : ""}
          ${uploadStatus.type === "loading" ? "bg-yellow-600 text-black" : ""}
        `}>
          {uploadStatus.message}
        </div>
      )}

      <div className="col-span-3">
        <div className="p-3 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
            <div>
              <h2 className="text-lg font-bold">Main Banner Image</h2>
              <p className="text-sm text-gray-600">Image size: 1920 × 800</p>
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "main")} className="hidden" id="upload-main" disabled={uploading} />
            <label htmlFor="upload-main" className={`cursor-pointer px-6 py-2 rounded-lg text-white font-medium ${uploading ? "bg-gray-400" : "bg-pink-500"} transition duration-300 hover:opacity-90`}>
              Upload
            </label>
          </div>

          {MainImages.main?.length > 0 ? (
            <div className="mt-6 relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
                autoplay={{ delay: 3000 }}
                loop
                className="rounded-lg overflow-hidden"
              >
                {MainImages.main.map((img) => (
                  <SwiperSlide key={img._id}>
                    <div className="relative group" onMouseEnter={() => setHoveredImage(img._id)} onMouseLeave={() => setHoveredImage(null)}>
                      <img src={img.imagesUrl} alt="Main" className="w-full h-[350px] object-cover rounded-lg transition-opacity duration-300" />
                      {hoveredImage === img._id && (
                        <button onClick={() => handleDelete(img._id, "main")} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-700 transition">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-pagination-custom absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 hidden"></div>
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
                <button className="swiper-button-prev-custom bg-white shadow-md p-2 rounded-full hover:bg-gray-200">
                  <IoIosArrowBack className="text-pink-500 text-xl hover:text-pink-700" />
                </button>
              </div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
                <button className="swiper-button-next-custom bg-white shadow-md p-2 rounded-full hover:bg-gray-200">
                  <IoIosArrowForward className="text-pink-500 text-xl hover:text-pink-700" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center text-gray-500">No images uploaded yet.</div>
          )}
        </div>
      </div>

      <div className="col-span-1 p-3 bg-white shadow-md rounded-lg">
        {renderUploadSection("newcollection", "New Collection")}
      </div>
      <div className="col-span-1 p-3 bg-white shadow-md rounded-lg">
        {renderUploadSection("special", "Special Offer")}
        <button className="w-full mt-2 px-6 py-2 rounded-lg text-white font-medium bg-green-500 hover:opacity-90">View Products</button>
      </div>
      <div className="col-span-3 p-3 bg-white shadow-md rounded-lg">
        {renderUploadSection("offer", "New Offer")}
      </div>
      <div className="col-span-3 p-3 bg-white shadow-md rounded-lg">
        {renderUploadSection("category", "Offer Category")}
      </div>
    </div>
  );
};

export default OfferImages;
