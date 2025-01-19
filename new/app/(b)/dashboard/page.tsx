"use client";

import React, { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMeditationPreference } from "@/contexts/MeditationPreferenceContext";
import { MeditationTable } from "@/app/(app)/@view/table";
import { useRouter } from "next/navigation";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
  </div>
);

const Page = () => {
  const { session, status } = useAuth();
  const { meditationPreferences, isLoading } = useMeditationPreference();
  const router = useRouter();
  if (status !== "authenticated") {
    router.push("/login");
  }
  return (
    <div className=" min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start py-10">
      <div className="max-w-4xl w-full px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8 mt-[70px]">
          Welcome <span className="text-purple-600">{session.user?.name}</span>
        </h1>

        <div className="flex justify-center gap-10 mb-10 mt-[100px]">
          <Card className="bg-white shadow-lg p-6 w-48 rounded-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <p className="text-sm text-gray-500">Last Meditation</p>
              <h2 className="text-2xl font-semibold text-gray-800">
                {new Date(
                  Math.max(
                    ...meditationPreferences.map((mp) =>
                      new Date(mp.createdAt).getTime()
                    )
                  )
                ).toLocaleDateString()}
              </h2>
            </div>
          </Card>
          <Card className="bg-white shadow-lg p-6 w-48 rounded-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Meditations</p>
              <h2 className="text-2xl font-semibold text-gray-800">
                {meditationPreferences.length}
              </h2>
            </div>
          </Card>
        </div>

        {/* Show Loading Spinner while data is being fetched */}
        {isLoading ? <LoadingSpinner /> : <MeditationTable />}
      </div>
    </div>
  );
};

export default Page;
