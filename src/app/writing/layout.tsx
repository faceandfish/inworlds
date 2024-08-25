import React from "react";
import Navbar from "@/components/Navbar"; // 确保路径正确

export default function ChapterEditLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar className="fixed top-0 w-full z-10" />
      <main className="pt-16 ">
        {/* pt-16 为 Navbar 留出空间 */}
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
