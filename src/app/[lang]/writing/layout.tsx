import React from "react";


export default function ChapterEditLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
   
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
