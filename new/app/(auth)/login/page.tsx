"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const { status } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signIn("google", { redirect: false });

      if (response?.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to log in", response?.error);
      }
    } catch (error) {
      console.error("Error signing in", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <Card className="px-8 py-12 max-w-md mx-auto mt-10 shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-black text-4xl font-bold">
            zen<span className="text-purple-500">haven</span>
          </h1>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </Button>
      </Card>
    </form>
  );
}
