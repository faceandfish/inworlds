import React from "react";
import {
  BellIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import { UserInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface NotificationSettingsProps {
  user: UserInfo;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  user
}) => {
  const { t } = useTranslation("profile");
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
    <div className="space-y-6 md:space-y-10 w-full">
      <div className="border-b pb-2">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-600">
          {t("notificationSettings.title")}
        </h2>
      </div>
      <form className="space-y-6 px-4 md:px-36">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-lg font-medium text-neutral-600 mb-4">
              {t("notificationSettings.notificationMethods")}
            </h3>
            {renderCheckbox(
              "push-notifications",
              t("notificationSettings.pushNotifications"),
              BellIcon
            )}
            {renderCheckbox(
              "email-notifications",
              t("notificationSettings.emailNotifications"),
              EnvelopeIcon
            )}
            {renderCheckbox(
              "sms-notifications",
              t("notificationSettings.smsNotifications"),
              ChatBubbleLeftIcon
            )}
          </div>
          <div className="w-full md:w-1/2 space-y-4 mt-6 md:mt-0">
            <h3 className="text-lg font-medium text-neutral-600 mb-4">
              通知类型
            </h3>
            {renderCheckbox(
              "new-message",
              t("notificationSettings.newMessageNotification")
            )}
            {renderCheckbox(
              "new-follower",
              t("notificationSettings.newFollowerNotification")
            )}
            {renderCheckbox(
              "system-updates",
              t("notificationSettings.systemUpdateNotification")
            )}
            {renderCheckbox(
              "favorite-book-updates",
              t("notificationSettings.favoriteBookUpdateNotification")
            )}
            {renderCheckbox(
              "followed-author-updates",
              t("notificationSettings.followedAuthorUpdateNotification")
            )}
          </div>
        </div>
        <div className="flex justify-center mt-10 md:mt-20">
          <button
            type="submit"
            className="w-full md:w-auto rounded-full py-2 px-6 border border-transparent shadow-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {t("notificationSettings.saveNotificationSettings")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;
