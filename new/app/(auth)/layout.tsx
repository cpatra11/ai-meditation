import React from "react";

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center py-10">
      {children}
    </main>
  );
};

export default LayoutAuth;
