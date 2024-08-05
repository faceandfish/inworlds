import React from "react";
import {
  ChartPieIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function AuthorAreaPage() {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-yellow-50 min-h-screen text-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          释放你的创作潜能
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-6 text-orange-600">
            为什么选择我们的平台？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <ChartPieIcon className="h-6 w-6 mr-2 text-yellow-500" />
              <p>接触百万级读者群体</p>
            </div>
            <div className="flex items-start">
              <ClockIcon className="h-6 w-6 mr-2 text-yellow-500" />
              <p>灵活的创作节奏</p>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 mr-2 text-yellow-500" />
              <p>专业的编辑团队支持</p>
            </div>
            <div className="flex items-start">
              <UserGroupIcon className="h-6 w-6 mr-2 text-yellow-500" />
              <p>活跃的作者社区</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-6 text-orange-600">
            丰厚的收益模式
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 mr-4 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold text-orange-500">
                  50% 广告收益分成
                </h3>
                <p className="text-sm text-gray-600">
                  您的作品产生的广告收入，我们平分
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 mr-4 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold text-orange-500">
                  版权交易平台
                </h3>
                <p className="text-sm text-gray-600">
                  直接在平台出售您的作品版权，获得额外收益
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full text-xl cursor-pointer hover:from-orange-600 hover:to-yellow-600 transition duration-300 transform hover:scale-105 shadow-lg">
            开启你的创作之旅
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
            常见问题
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer text-orange-500">
                创作需要付费吗？
              </summary>
              <p className="mt-2 text-gray-600">
                完全免费！我们相信优质内容自然会带来收益。
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer text-orange-500">
                我的作品版权归属？
              </summary>
              <p className="mt-2 text-gray-600">
                版权100%归您所有，我们仅获得在平台展示和销售的权利。
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer text-orange-500">
                对更新频率有要求吗？
              </summary>
              <p className="mt-2 text-gray-600">
                没有硬性要求，但建议保持稳定更新以维持读者热情。
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
