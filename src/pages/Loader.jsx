import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-12 h-12">
        <div className="w-full h-full rounded-full border-4 border-transparent border-t-[#dc4298] border-r-[#d8e029] animate-spin"></div>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(to right, #dc4298, #d8e029)",
            maskImage: "radial-gradient(circle, rgba(0, 0, 0, 0.6) 50%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0, 0, 0, 0.6) 50%, transparent 60%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
