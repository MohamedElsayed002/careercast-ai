// app/not-found.tsx
"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import animationData from "@/public/404-error.json";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center space-y-8 px-4">
      <div className="w-96 h-96">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <Link
        href="/"
        className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
