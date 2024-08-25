"use client";
import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import Navbar from "@/components/Navbar";
import { useUserInfo } from "@/components/useUserInfo";

import Sidebar from "@/components/Studio/Sidebar";
import WorkContent from "@/components/Studio/WorkContent";
import DataAnalysis from "@/components/Studio/DataAnalysis";

function Studio() {
  return (
    <>
      <Navbar />
      <Sidebar />
    </>
  );
}

export default Studio;
