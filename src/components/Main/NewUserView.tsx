import React, { useState } from "react";
import {
  PencilIcon,
  UsersIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { UserInfo, ApiResponse } from "@/app/lib/definitions";
import Alert from "./Alert";
import { useTranslation } from "../useTranslation";
import { updateUserType } from "@/app/lib/action";
import { useUser } from "../UserContextProvider";

interface BecomeCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BecomeCreatorModal: React.FC<BecomeCreatorModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation("book");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  if (!isOpen || !user) return null;
  const handleBecomeCreator = async () => {
    if (user.userType === "creator") {
      setAlert({
        message: t("newUserView.alreadyCreator"),
        type: "success"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateUserType(user.id, "creator"); // 直接传入 "creator" 作为新的类型
      if (response.code === 200) {
        setAlert({
          message: t("newUserView.congratulations"),
          type: "success"
        });

        // 调用成功回调
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }

        // 延迟关闭modal
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to become a creator:", error);
      setAlert({
        message: t("newUserView.becomeCreatorFailed"),
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { Icon: PencilIcon, text: t("newUserView.publishOriginalContent") },
    { Icon: UsersIcon, text: t("newUserView.interactWithReaders") },
    { Icon: CurrencyDollarIcon, text: t("newUserView.earnFromCreations") }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
            {t("newUserView.becomeCreator")}
          </h2>

          <div className="space-y-8">
            <div className="space-y-6">
              {features.map(({ Icon, text }, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-lg text-gray-700">{text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleBecomeCreator}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:bg-orange-300"
            >
              {isLoading
                ? t("newUserView.processing")
                : user.userType === "creator"
                ? t("newUserView.alreadyCreator")
                : t("newUserView.startCreatingJourney")}
            </button>
          </div>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
};
