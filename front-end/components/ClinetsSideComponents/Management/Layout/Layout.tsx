"use client"
import Header from "@/app/(management)/components/Header";
import Sidebar from "@/app/(management)/components/Sidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {

  const [sidebarOpen,setSidebarOpen]=useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-red-600 to-red-950">

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          <Header openSideBar={setSidebarOpen} />
          <main className="rounded-lg">{children}</main>
        </div>
      </div>

    </div>
  );
}