import React from "react";
import { HiGift } from "react-icons/hi2";

export const DonationTip: React.FC = () => (
  <div className="bg-orange-100 p-4 rounded-lg shadow">
    <h3 className="font-bold flex items-center text-orange-800">
      <HiGift className="mr-2 text-orange-400 text-xl" />
      打赏提示
    </h3>
    <p className="mt-2 text-orange-700">
      您的打赏将直接支持作者创作更多优质内容。感谢您的支持!
    </p>
  </div>
);
