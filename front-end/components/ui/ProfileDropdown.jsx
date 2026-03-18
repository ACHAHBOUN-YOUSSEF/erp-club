"use client";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { toast } from "react-toastify";
import Spinner from "./spinner";
import { useState } from "react";
export default function ProfileDropdown({ expiresAt, user, loading = false }) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false)
  const handleLogout = async () => {
    setIsBusy(true)
    try {
      await AuthService.logout().then((res) => {
        toast.success(res.message)
        router.push("/login")
        if (Cookies.get("token")) Cookies.remove("token")
        setIsBusy(false)
      })
    } catch (err) {
      toast.warn("Erreur Serveur")
    };
    setIsBusy(false)

  }
  if (loading) {
    return (
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-20" />
          <div className="h-3 bg-gray-300 rounded w-24" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer p-0.5 rounded-full bg-green-500 hover:bg-green-700 transition-all duration-200">
          {isBusy && (<Spinner />)}
          {user?.imagePath ? (
            <img
              className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
              src={user.imagePath}
              alt={`${user.firstName} ${user.lastName}`}
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 mr-3" align="end">
        <DropdownMenuLabel className="p-3 pb-2">
          <div className="font-bold text-base text-foreground mb-1">
            {user?.firstName || "Utilisateur"} {user?.lastName || ""}
          </div>
          <div className="text-xs bg-muted px-2 py-0.5 rounded-2xl mt-1 inline-block">
            {user?.role || "Utilisateur"}
          </div>
          <div className="text-xs text-muted-foreground truncate max-w-[220px]">
            {user?.email || "email@example.com"}
          </div>
          <div className="text-xs text-muted-foreground truncate max-w-[220px]">
            Expirée dans : {expiresAt}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleLogout()}
          className="text-red-600 font-semibold hover:bg-red-50 flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Se Déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
