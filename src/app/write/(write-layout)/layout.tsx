"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import WritingSidebar from "@/components/WritingPage/WritingSidebar";
import Footer from "@/components/WritingPage/Footer";

interface WritingLayoutProps {
  children: React.ReactNode;
}

const WritingLayout: React.FC<WritingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <WritingSidebar />
        <main className="flex flex-col flex-1 overflow-auto">
          <div className="flex-grow p-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default WritingLayout;
