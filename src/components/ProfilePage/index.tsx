import React, { useState, useEffect } from "react";
import WorksSection from "./WorksSection";
import Header from "./Header";

export default function ProfilePage() {
  return (
    <div className="max-w-full mx-auto">
      <Header />
      <div className="text-center"></div>
      <WorksSection />
    </div>
  );
}
