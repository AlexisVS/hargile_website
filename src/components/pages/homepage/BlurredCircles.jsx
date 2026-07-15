"use client";
import { useEffect, useRef } from "react";

const BlurredCircles = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Large blue gradient circle - top right */}
      <div
        className="absolute -top-64 -right-64 w-192 h-192 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(150,185,249,0.6) 0%, rgba(150,185,249,0.1) 70%, rgba(150,185,249,0) 100%)",
          filter: "blur(80px)",
        }}
      ></div>

      {/* Medium blue gradient circle - bottom left */}
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.1) 70%, rgba(59,130,246,0) 100%)",
          filter: "blur(60px)",
        }}
      ></div>

      {/* Small cyan gradient circle - middle right */}
      <div
        className="absolute top-1/3 -right-16 w-64 h-64 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(34,211,238,0.1) 70%, rgba(34,211,238,0) 100%)",
          filter: "blur(40px)",
        }}
      ></div>

      {/* Tiny amber gradient circle - top left */}
      <div
        className="absolute top-32 left-16 w-32 h-32 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(245,194,107,0.6) 0%, rgba(245,194,107,0.1) 70%, rgba(245,194,107,0) 100%)",
          filter: "blur(30px)",
        }}
      ></div>
    </div>
  );
};

export default BlurredCircles;
