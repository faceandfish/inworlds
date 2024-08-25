import React from "react";
import {
  BellIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import { UserInfo } from "@/app/lib/definitions";

interface NotificationSettingsProps {
  user: UserInfo;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  user
}) => {
  const renderCheckbox = (
    id: string,
    label: string,
    icon?: React.ElementType
  ) => (
    <div className="flex items-center mb-4">
      <input
        id={id}
        name={id}
        type="checkbox"
        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
      />
      <label
        htmlFor={id}
        className="ml-3 block text-sm font-medium text-neutral-600"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="space-y-10 w-full">
      <div className="border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">通知设置</h2>
      </div>
      <form className="space-y-6 px-36">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-lg font-medium text-neutral-600 mb-4">
              接收通知方式
            </h3>
            {renderCheckbox("push-notifications", "推送通知", BellIcon)}
            {renderCheckbox(
              "email-notifications",
              "电子邮件通知",
              EnvelopeIcon
            )}
            {renderCheckbox(
              "sms-notifications",
              "短信通知",
              ChatBubbleLeftIcon
            )}
          </div>
          <div className="md:w-1/2 space-y-4 mt-6 md:mt-0">
            <h3 className="text-lg font-medium text-neutral-600 mb-4">
              通知类型
            </h3>
            {renderCheckbox("new-message", "新消息通知")}
            {renderCheckbox("new-follower", "新粉丝通知")}
            {renderCheckbox("system-updates", "系统更新通知")}
            {renderCheckbox("favorite-book-updates", "收藏的书籍更新通知")}
            {renderCheckbox("followed-author-updates", "关注的作者更新通知")}
          </div>
        </div>
        <div className="flex justify-center !mt-20">
          <button
            type="submit"
            className="rounded-full py-2 px-6 border border-transparent shadow-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            保存通知设置
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;
