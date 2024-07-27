"use client";

import Navbar from "@/components/Navbar";
import {
  CreatorView,
  NewUserView,
} from "@/components/WritingPage/WriterHomepage";
import React, { useState, useEffect } from "react";

const page = () => {
  const [isCreator, setIsCreator] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleCreatorStatus = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsCreator(!isCreator);
      setIsVisible(true);
    }, 300);
  };
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="font-sans   ">
      <Navbar />
      <div
        className={`transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {isCreator ? (
          <CreatorView toggleCreatorStatus={toggleCreatorStatus} />
        ) : (
          <NewUserView toggleCreatorStatus={toggleCreatorStatus} />
        )}
      </div>
    </div>
  );
};

export default page;
