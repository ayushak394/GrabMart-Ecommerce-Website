"use client";

import { ShoppingCart, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authFetch } from "@/app/utils/AuthFetch";

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const { cartCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    onLogout?.();

    router.replace("/");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    const fetchProfilePic = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getProfilePic/${userId}`,
        );
        const data = await res.json();
        setProfilePic(data.profilePic);
      } catch (err) {
        console.log("No profile pic found");
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            href="/HomePage"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10">
              <img
                src="/favicon.ico"
                alt="GrabMart Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground hidden sm:inline">
              GrabMart
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/CartPage"
              className="relative p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <ShoppingCart
                className="text-foreground group-hover:text-primary transition-colors"
                size={24}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in scale-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="hidden md:block relative group">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/20 flex items-center justify-center">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/user.png"
                      alt="Default Profile Pic"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {/* Profile */}
                <button
                  onClick={() => router.push("/ProfilePage")}
                  className="w-full px-4 py-3 text-left text-foreground hover:bg-muted rounded-t-lg flex items-center gap-2 transition-colors"
                >
                  My Profile
                </button>

                {/* Orders */}
                <button
                  onClick={() => router.push("/OrderPage")}
                  className="w-full px-4 py-3 text-left text-foreground hover:bg-muted flex items-center gap-2 transition-colors border-t border-border"
                >
                  My Orders
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 transition-colors border-t border-border"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <a className="block py-2" href="/HomePage">
              Home
            </a>
            <a className="block py-2" href="/Categories">
              Categories
            </a>
            <a className="block py-2" href="/Deals">
              Deals
            </a>

            {/* Profile */}
            <button
              onClick={() => router.push("/ProfilePage")}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-muted rounded-lg"
            >
              Profile
            </button>

            {/* Orders */}
            <button
              onClick={() => router.push("/OrderPage")}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-muted rounded-lg"
            >
              Orders
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
