"use client";

import Navbar from "@/components/shared/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useMeditationPreference } from "@/contexts/MeditationPreferenceContext";

export default function Layout({
  children,
  view,
  landingpage,
  dash,
}: {
  children: React.ReactNode;
  view: React.ReactNode;
  landingpage: React.ReactNode;
  dash: React.ReactNode;
}) {
  const { session } = useAuth();
  console.log(session);
  return (
    <>
      <Navbar />
      <main>
        {children}
        {session?.user.email ? view : landingpage}
      </main>
    </>
  );
}
