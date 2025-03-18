import React, { useState, useEffect } from "react";
import { storage, databases } from "../../lib/appwrite";
import { ID } from "appwrite";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Arrow icons
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const OfferImages = () => {
  const [MainImages, setMainImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
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
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_OFFER_COLLECTION_ID
        );

        const categorizedImages = response.documents.reduce((acc, img) => {
          if (img.tag === "main") {
            // Store multiple images for "main"
            if (!acc["main"]) {
              acc["main"] = [];
            }
            acc["main"].push(img);
          } else {
            // Store only ONE image per tag for other categories
            acc[img.tag] = img;
          }
          return acc;
        }, {});

        setMainImages(categorizedImages);
        console.log(categorizedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
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
          setUploadStatus({ type: "error", message: `Image must be ${width}x${height} pixels.` });
          resolve(false);
        }
      };
    });
  };



  const handleImageUpload = async (event, tag) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadStatus({ type: "error", message: "Please select an image." });
      return;
    }
    if (tag !== "main" && MainImages[tag]) {
      setUploadStatus({ type: "error", message: "Only one image allowed for this category." });
      return;
    }
    const isValid = await validateImageSize(file, tag);
    if (!isValid) {
      return;
    }
    setUploading(true);
    setUploadStatus({ type: "loading", message: "Uploading..." });
    try {
      const uploadedFile = await storage.createFile(
        import.meta.env.VITE_APPWRITE_OFFER_BUCKET_ID,
        ID.unique(),
        file
      );

      const imageUrl = storage.getFilePreview(
        import.meta.env.VITE_APPWRITE_OFFER_BUCKET_ID,
        uploadedFile.$id
      );

      const newImage = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_OFFER_COLLECTION_ID,
        ID.unique(),
        {
          tag,
          imageurl: imageUrl,
          imageid: uploadedFile.$id,
        }
      );

      setMainImages((prev) => {
        if (tag === "main") {
          return { ...prev, [tag]: [...(prev[tag] || []), newImage] };
        } else {
          return { ...prev, [tag]: newImage };
        }
      });

      setUploadStatus({ type: "success", message: "Upload Completed!" });


    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus({ type: "error", message: "Upload Failed!" });
    }
    setUploading(false);
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleDelete = async (imageId, imageKey) => {
    try {
      // Delete the document from Appwrite
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_OFFER_COLLECTION_ID,
        imageId
      );

      // Update state to remove the deleted image
      setMainImages((prevImages) => {
        if (imageKey === "main") {
          // Remove from 'main' array
          return {
            ...prevImages,
            main: prevImages.main.filter((img) => img.$id !== imageId),
          };
        } else {
          // Remove single image tags
          const newImages = { ...prevImages };
          delete newImages[imageKey];
          return newImages;
        }
      });

      setUploadStatus({ type: "success", message: "Image deleted successfully." });

    } catch (error) {
      console.error("Error deleting image:", error);
      setUploadStatus({ type: "error", message: "Failed to delete image. Please try again." });
    }
    setTimeout(() => setUploadStatus(null), 3000);
  };



  const renderUploadSection = (tag, title) => {
    const { width, height } = imageSizes[tag];

    return (
      <div>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-gray-600">
              Image size: {width} × {height}
            </p>
          </div>
          {!MainImages[tag] ? (
            <>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, tag)} className="hidden" id={`upload-${tag}`} disabled={uploading} />
              <label htmlFor={`upload-${tag}`} className={`cursor-pointer px-6 py-2 rounded-lg text-white font-medium ${uploading ? "bg-gray-400" : "bg-pink-500"} transition duration-300 hover:opacity-90`}>
                Upload
              </label>
            </>
          ) : (
            <button
              onClick={() => handleDelete(MainImages[tag].$id, tag)}
              className="cursor-pointer px-6 py-2 rounded-lg text-white font-medium bg-red-500  transition duration-300 hover:opacity-90"
            >
              Delete
            </button>

          )}
        </div>

        {MainImages[tag]?.imageurl ? (
          <div className="mt-4 relative flex items-center justify-center">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src={MainImages[tag].imageurl} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center text-gray-500">No images uploaded yet.</div>
        )}

      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
      {uploadStatus && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg 
      ${uploadStatus.type === "success" ? "bg-green-600 text-white" : ""}
      ${uploadStatus.type === "error" ? "bg-red-600 text-white" : ""}
      ${uploadStatus.type === "loading" ? "bg-yellow-600 text-black" : ""}
    `}
        >
          {uploadStatus.message}
        </div>
      )}
     
      <div className="col-span-3 ">
        <div className="p-3 bg-white shadow-md rounded-lg">
          {/* Header Section */}
          <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
            <div>
              <h2 className="text-lg font-bold">Main Banner Image</h2>
              <p className="text-sm text-gray-600">Image size: 1920 × 800</p>
            </div>
            <div>
              {/* Disable upload button if uploading is in progress */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "main")}
                className="hidden"
                id="upload-main"
                disabled={uploading}
              />
              <label
                htmlFor="upload-main"
                className={`cursor-pointer px-6 py-2 rounded-lg text-white font-medium ${uploading ? "bg-gray-400" : "bg-pink-500"
                  } transition duration-300 hover:opacity-90`}
              >
                Upload
              </label>
            </div>
          </div>

          {/* Slideshow Section */}
          {/* Slideshow Section */}
          {MainImages.main && MainImages.main.length > 0 ? (
            <div className="mt-6 relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-custom",
                }}
                autoplay={{ delay: 3000 }}
                loop={true}
                className="rounded-lg overflow-hidden"
              >
                {MainImages.main.map((img) => (
                  <SwiperSlide key={img.$id}>
                    <div
                      className="relative group"
                      onMouseEnter={() => setHoveredImage(img.$id)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      {/* Image */}
                      <img
                        src={img.imageurl}
                        alt="Offer Banner"
                        className="w-full h-[350px] object-cover rounded-lg transition-opacity duration-300"
                      />

                      {/* Delete Button (Only on Hover) */}
                      {hoveredImage === img.$id && (
                        <button
                          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition"
                          onClick={() => handleDelete(img.$id, img.tag)}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      )}

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Pagination */}
              <div className="swiper-pagination-custom absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 hidden"></div>

              {/* Navigation Buttons */}
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
            // Show a message when no images are uploaded
            <div className="mt-6 text-center text-gray-500">No images uploaded yet.</div>
          )}

        </div>
      </div>
      <div  className="col-span-1 p-3 bg-white shadow-md rounded-lg ">
        {renderUploadSection("newcollection", "New Collection")}
      </div>
      <div className="col-span-1 p-3 bg-white shadow-md rounded-lg">
        {renderUploadSection("special", "Special Offer")}
        <button className=" w-full mt-2 cursor-pointer px-6 py-2 rounded-lg text-white font-medium bg-green-500  transition duration-300 hover:opacity-90">View Products</button>
      </div>
      <div className="col-span-3 p-3 bg-white shadow-md rounded-lg ">
        {renderUploadSection("offer", "New Offer")}
      </div>
      <div className="col-span-3 p-3 bg-white shadow-md rounded-lg">
        {renderUploadSection("category", " Offer Category")}
      </div>
     
     
      


    </div>
  );
};

export default OfferImages;
