"use client"
import { useEffect, useState } from "react";
import ProfileDropdown from "../../../components/ui/ProfileDropdown";
import { AuthService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { setPermissions } from "@/store/permissionsSlice";
import { Menu, X } from "lucide-react";
type props = {
  openSideBar: (value: boolean) => void
}
export default function Header({ openSideBar }: props) {
  // export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState("")
  const [SidebarOpen, setSideBarOpen] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const me = await AuthService.me();
        dispatch(setPermissions(me.data.user.permissions))
        setExpiresAt(new Date(me.data.expiresAt).toLocaleString());
        setUser(me?.data?.user || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="bg-black/15 shadow-2xs border-b border-white mx-2 mt-0.5 rounded-lg">
      <div className="max-w-7xl mx-auto py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center sm:text-left">


          {SidebarOpen ? (
            <Menu
              onClick={() => {
                const value = !SidebarOpen;
                setSideBarOpen(value);
                openSideBar(value);
              }}
              className="cursor-pointer hover:bg-red-50/20 rounded-sm"
            />
          ) : (
            <X
              onClick={() => {
                const value = !SidebarOpen;
                setSideBarOpen(value);
                openSideBar(value);
              }}
              className="cursor-pointer hover:bg-red-50/20 rounded-sm"
            />
          )}
        </h1>

        <div className="flex items-center">
          <ProfileDropdown expiresAt={expiresAt} user={user} loading={loading} />
        </div>
      </div>
    </header>
  );
}
