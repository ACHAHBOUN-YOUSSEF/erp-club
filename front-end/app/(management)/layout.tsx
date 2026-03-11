"use client"
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"
export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-red-600 to-red-950">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          <Header/>
          <main className=" rounded-lg">{children}</main>
        </div>
      </div>
    </div>
  );
}
