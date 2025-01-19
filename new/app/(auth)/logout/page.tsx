"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "@/lib/auth";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const signOutAndRedirect = async () => {
      await signOut();
      router.push("/login");
    };

    signOutAndRedirect();
  }, [router]);

  return null;
}
