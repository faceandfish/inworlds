import React from "react";
import {
  PencilIcon,
  UsersIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { UserInfo } from "@/app/lib/definitions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NewUserViewProps {
  user: UserInfo;
  onUserTypeChange: (newUserInfo: UserInfo) => Promise<void>;
}

export const NewUserView: React.FC<NewUserViewProps> = ({
  user,
  onUserTypeChange
}) => {
  const handleBecomeCreator = async () => {
    if (user.userType === "creator") {
      toast.info("你已经是创作者了！");
      return;
    }

    try {
      const newCreatorInfo: UserInfo = {
        ...user,
        userType: "creator",
        articlesCount: 0,
        followersCount: 0,
        followingCount: 0,
        favoritesCount: 0
      };

      await onUserTypeChange(newCreatorInfo);
      toast.success("恭喜你成为创作者！");
    } catch (error) {
      console.error("Failed to become a creator:", error);
      toast.error("成为创作者失败，请稍后重试");
    }
  };

  const features = [
    { Icon: PencilIcon, text: "发布原创内容，展示你的才华" },
    { Icon: UsersIcon, text: "与读者互动，建立你的粉丝群" },
    { Icon: CurrencyDollarIcon, text: "获得创作收益，实现你的梦想" }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-purple-100 to-orange-200 flex justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-orange-600 my-8">
            成为创作者
          </h1>
        </div>

        <div className="bg-white px-20 py-20 mx-auto w-2/3 shadow-xl rounded-lg overflow-hidden">
          <div className="">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              加入我们的创作者社区，分享你的想法和故事
            </h2>
            <div className="space-y-6">
              {features.map(({ Icon, text }, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-lg text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-8 pt-8">
            <button
              onClick={handleBecomeCreator}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105"
            >
              {user.userType === "creator"
                ? "你已经是创作者啦！"
                : "立即开始创作之旅"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
