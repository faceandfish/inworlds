import React from "react";
import { LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { ChangePasswordRequest } from "@/app/lib/definitions";

interface SecuritySettingsProps {
  onPasswordChange: (passwordData: ChangePasswordRequest) => Promise<void>;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onPasswordChange
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 这里获取表单数据并调用 onPasswordChange
    // const passwordData: ChangePasswordRequest = { ... };
    // onPasswordChange(passwordData);
  };

  const renderPasswordField = (
    id: string,
    label: string,
    placeholder: string
  ) => (
    <div className="flex items-center mb-4">
      <div className="w-40 flex justify-end items-center pr-4">
        <label htmlFor={id} className="text-sm font-medium text-neutral-600">
          {label}:
        </label>
      </div>
      <div className="w-2/3 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockClosedIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="password"
          id={id}
          className="w-full p-2 pl-10 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-10 w-full">
      <div className="border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">安全设置</h2>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit}>
        {renderPasswordField("current-password", "当前密码", "输入当前密码")}
        {renderPasswordField("new-password", "新密码", "输入新密码")}
        {renderPasswordField(
          "confirm-password",
          "确认新密码",
          "再次输入新密码"
        )}
        <div className="flex items-center">
          <div className="w-40 flex justify-end items-center pr-4">
            <label
              htmlFor="two-factor-auth"
              className="text-sm font-medium text-neutral-600"
            >
              两步验证:
            </label>
          </div>
          <div className="w-2/3">
            <input
              id="two-factor-auth"
              name="two-factor-auth"
              type="checkbox"
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label
              htmlFor="two-factor-auth"
              className="ml-2 text-sm text-gray-700"
            >
              启用两步验证
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 mx-auto rounded-full block py-3 px-6 border border-transparent shadow-sm font-medium text-white bg-orange-400 hover:bg-orange-500"
        >
          更新安全设置
        </button>
      </form>
    </div>
  );
};

export default SecuritySettings;
