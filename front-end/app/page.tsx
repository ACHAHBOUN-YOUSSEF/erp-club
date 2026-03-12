'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [seconds, setSeconds] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (seconds === 0) {
      router.push('/login');
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      
      <h1 className="text-5xl font-bold text-red-600 mb-6">
        ERP STARGYM
      </h1>

      <p className="text-xl text-white mb-4">
        Redirection vers la page de connexion
      </p>

      <p className="text-3xl font-bold text-red-500">
        {seconds}
      </p>

      <p className="text-gray-400 mt-2">
        seconde(s) restantes...
      </p>

    </div>
  );
}