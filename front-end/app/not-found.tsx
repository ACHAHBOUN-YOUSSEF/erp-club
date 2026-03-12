"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-center">
      <div>
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="text-white text-xl mt-4">
          Page introuvable
        </p>
        <p className="text-gray-400 mt-2">
          Redirection vers login dans 5 secondes...
        </p>
      </div>
    </div>
  );
}