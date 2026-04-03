"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

const publicRoutes = ["/", "/LoginPage", "/SignUpPage", "/ForgotPassPage"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (publicRoutes.includes(pathname)) return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        router.push("/");
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}