"use client";
import Link from "next/link";
import { Home, Users, Settings, Box, Search, Ticket, Receipt, Layers, Menu, ChevronsLeftRightIcon, Wrench, Cctv, Terminal, UserCheck, Download } from "lucide-react";
import { useState } from "react";
import { usePermission } from "@/hooks/usePermission";
type props = {
    isOpen: boolean
}
export default function Sidebar({ isOpen }: props) {
    const [openAdherents, setOpenAdherents] = useState(false)
    const [openServices, setOpenServices] = useState(false)
    const [opensettings, setOpenSettings] = useState(false)
    const [openOutils, setOpenOutils] = useState(false)
    const [isSideBarOpen, setIsSideBarOpen] = useState(true)
    const canViewSettings=usePermission("view_settings")
    return (

        <aside className={`h-screen bg-black/30 ${isOpen ? 'hidden' : ''} text-gray-100 flex flex-col p-2 gap-2 overflow-y-auto overflow-x-hidden ${isSideBarOpen ? "w-50" : "w-15"} transition-all duration-500 ease-in-out`}>
            <div className="flex items-center px-2 py-2">
                <div>
                    <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                        <Menu size={26} className="transition-colors max-w-fit cursor-pointer" />
                    </button>
                </div>
                {
                    isSideBarOpen && (
                        <p className="ml-2 text-xl  font-bold  border-b-2 border-gray-400">STARGYM</p>
                    )
                }
            </div>
            <Link href={"/dashboard"}>
                <button
                    className="flex items-center justify-between cursor-pointer px-3 py-2 w-full font-bold  hover:bg-red-600 rounded-md transition"
                >
                    <div className="flex items-center gap-3">
                        <Home className="w-5 text-black" />
                        {
                            isSideBarOpen && (

                                <span>Dashboard</span>

                            )
                        }
                    </div>
                </button>
            </Link>
            <button
                onClick={() => setOpenAdherents(!openAdherents)}
                className="flex items-center justify-between cursor-pointer px-3 py-2 w-full font-bold  hover:bg-red-600 rounded-md transition"
            >
                <div className="flex items-center gap-3">
                    <Users className="w-5 text-black" />
                    {
                        isSideBarOpen && (
                            <span>Adhérents</span>
                        )
                    }
                </div>
                <ChevronsLeftRightIcon
                    className={`w-4 h-4 text-black transition-transform ${openAdherents ? "rotate-90" : "rotate-0"}`}
                />
            </button>

            {openAdherents && (
                <div className="flex flex-col ml-6 mt-1 gap-1">
                    {
                        isSideBarOpen && (
                            <>
                                <Link
                                    href="/adherents"
                                    className="px-3 py-1 flex items-center  hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                                >
                                    <Users className="w-4 h-4 mr-2 text-black" />
                                    adhérents
                                </Link>
                                {/* <Link
                                    href="/#"
                                    className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                                >
                                    <Filter className="w-4 h-4 mr-2 text-black" />
                                    Filter
                                </Link> */}
                                <Link
                                    href="/adherents/search"
                                    className="px-3 py-1 flex items-center  hover:bg-red-100 hover:text-black font-bold  rounded-md transition"
                                >
                                    <Search className="w-4 h-4 mr-2 text-black" />
                                    Recherche
                                </Link>
                                <Link
                                    href="/adherents/export"
                                    className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                                >
                                    <Download className="w-4 h-4 mr-2 text-black" />
                                    Export
                                </Link>
                            </>
                        )
                    }

                </div>
            )}

            <button
                onClick={() => setOpenServices(!openServices)}
                className="flex items-center justify-between cursor-pointer px-3 py-2 w-full font-bold  hover:bg-red-600 rounded-md transition"
            >
                <div className="flex items-center gap-3">
                    <Box className="w-5 h-5 text-black" />
                    {isSideBarOpen && (
                        <span>Services</span>
                    )}
                </div>
                <ChevronsLeftRightIcon
                    className={`w-4  text-black transition-transform ${openServices ? "rotate-90" : "rotate-0"}`}
                />
            </button>
            {
                openServices && (
                    <div className="flex flex-col ml-6 mt-1 gap-1">
                        {isSideBarOpen && (
                            <>
                                <Link
                                    href="/services/personnel"
                                    className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                                >
                                    <Users className="w-4 h-4 mr-2 text-black" />
                                    Personnel
                                </Link>
                                <Link
                                    href="/services/abonnements"
                                    className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                                >
                                    <Ticket className="w-4 h-4 mr-2 text-black" />
                                    Abonnements
                                </Link>
                                <Link
                                    href="/services/transactions"
                                    className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold  rounded-md transition"
                                >
                                    <Receipt className="w-4 h-4 mr-2 text-black" />
                                    Transactions
                                </Link>
                            </>
                        )}
                    </div>
                )
            }
            <button
                onClick={() => setOpenSettings(!opensettings)}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 w-full font-bold  hover:bg-red-600 rounded-md transition`}>
                <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-black" />
                    {isSideBarOpen && (
                        <span>Paramètres</span>
                    )}
                </div>
                <ChevronsLeftRightIcon
                    className={`w-4 text-black transition-transform ${opensettings ? "rotate-90" : "rotate-0"}`}
                />
            </button>
            {
                opensettings && (
                    <div className="flex flex-col ml-6 mt-1 gap-1">
                        {isSideBarOpen && (
                            <>
                                <Link
                                    href="/settings/multiclub"
                                    className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                                >
                                    <Layers className="w-4 h-4 mr-2 text-black" />
                                    MultiClub
                                </Link>
                            </>
                        )}
                    </div>
                )
            }
            <button
                onClick={() => setOpenOutils(!openOutils)}
                className="flex items-center justify-between cursor-pointer px-3 py-2 w-full font-bold  hover:bg-red-600 rounded-md transition"
            >
                <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-black" />
                    {isSideBarOpen && (
                        <span>Outils</span>
                    )}
                </div>
                <ChevronsLeftRightIcon
                    className={`w-4 text-black transition-transform ${openOutils ? "rotate-90" : "rotate-0"}`}
                />
            </button>
            {openOutils && (
                <div className="flex flex-col ml-6 mt-1 gap-1">
                    {isSideBarOpen && (
                        <>
                            <Link
                                // href="/outils/Monitoring"
                                href="#"
                                className="px-3 py-1 flex  items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                            >
                                <Cctv className="w-4 h-4 mr-2 text-black" />
                                Monitoring
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                            >
                                <Terminal className="w-4 h-4 mr-2 text-black" />
                                Mode DEV
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-1 flex items-center hover:bg-red-100 hover:text-black font-bold rounded-md transition"
                            >
                                <UserCheck className="w-4 h-4 mr-2 text-black" />
                                Access Control
                            </Link>
                        </>
                    )}
                </div>
            )}
            {/* <button className="flex items-center gap-3 px-3 py-2 mt-auto text-red-400 hover:text-red-300 font-bold  hover:bg-red-600 rounded-md transition">
                Déconnexion
            </button> */}
        </aside>
    );
}
