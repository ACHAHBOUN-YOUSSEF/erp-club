// Header.jsx (JavaScript pur ✅)
"use client"
import { useEffect, useState } from "react";
import ProfileDropdown from "../../../components/ui/ProfileDropdown";
import GradientText from "@/components/ui/textType/GradientText";
import { AuthService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { setPermissions } from "@/store/permissionsSlice";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState("")
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
    <header className="bg-black/15 shadow-2xs border-b border-white mx-2 mt-2 rounded-lg">
      <div className="max-w-7xl mx-auto py-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center sm:text-left">
          <GradientText
            colors={["#ff0000", "#000000", "#ffffff", "#ff0000"]}
            animationSpeed={3}
            showBorder={false}
            className="font-bold text-3xl"
          >
            ERP-STARGYM
          </GradientText>
        </h1>

        <div className="flex items-center">
          <ProfileDropdown expiresAt={expiresAt} user={user} loading={loading} />
        </div>
      </div>
    </header>
  );
}
