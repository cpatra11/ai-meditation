import Navbar from "@/components/shared/Navbar";
import React from "react";

const Blayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

export default Blayout;
