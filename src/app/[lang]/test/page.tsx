"use client";

import { useState, useRef, useEffect } from "react";
import { updateReadingStats } from "@/app/lib/action";
import { fetchSingleBookAnalytics } from "@/app/lib/action";
import { ApiResult, AnalyticsData } from "@/app/lib/definitions";

export default function ReadingStatsTest() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [testResult, setTestResult] = useState<any>(null);
  const bookId = 1; // 测试用的书籍ID
  const chapterId = 1; // 测试用的章节ID

  // 测试正常阅读场景
  const testNormalReading = async () => {
    const readingData = {
      bookId,
      chapterId,
      startTime: Date.now() - 300000, // 5分钟前开始
      activeTime: 280000, // 读了4分40秒
      readingProgress: 98,
      totalWords: 2000,
      isActive: true,
      isValidReading: true
    };

    try {
      // 1. 先获取当前分析数据
      const beforeAnalytics = await fetchSingleBookAnalytics(bookId);
      console.log("更新前的数据:", beforeAnalytics);

      // 2. 更新阅读统计
      const response = await updateReadingStats(readingData);

      // 3. 等待1秒，让后端处理数据
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 4. 再次获取分析数据
      const afterAnalytics = await fetchSingleBookAnalytics(bookId);
      console.log("更新后的数据:", afterAnalytics);

      setTestResult({
        before: beforeAnalytics,
        updateResponse: response,
        after: afterAnalytics
      });

      // 5. 更新显示的分析数据
      if (afterAnalytics.code === 200 && "data" in afterAnalytics) {
        setAnalyticsData(afterAnalytics.data);
      }
    } catch (error) {
      console.error("测试失败:", error);
      setTestResult({ error });
    }
  };

  // 测试快速滚动（无效阅读）场景
  const testInvalidReading = async () => {
    const readingData = {
      bookId,
      chapterId,
      startTime: Date.now() - 10000, // 10秒前
      activeTime: 5000, // 只读了5秒
      readingProgress: 100,
      totalWords: 2000,
      isActive: true,
      isValidReading: false
    };

    try {
      const beforeAnalytics = await fetchSingleBookAnalytics(bookId);
      const response = await updateReadingStats(readingData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const afterAnalytics = await fetchSingleBookAnalytics(bookId);

      setTestResult({
        before: beforeAnalytics,
        updateResponse: response,
        after: afterAnalytics
      });

      if (afterAnalytics.code === 200 && "data" in afterAnalytics) {
        setAnalyticsData(afterAnalytics.data);
      }
    } catch (error) {
      console.error("测试失败:", error);
      setTestResult({ error });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">阅读统计测试</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testNormalReading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          测试正常阅读
        </button>

        <button
          onClick={testInvalidReading}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          测试无效阅读
        </button>
      </div>

      {analyticsData && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">当前分析数据：</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>浏览量: {analyticsData.views}</p>
            <p>24小时浏览量: {analyticsData.viewsLast24h}</p>
            <p>点赞数: {analyticsData.likes}</p>
            <p>评论数: {analyticsData.comments}</p>
            <p>总收入: {analyticsData.totalIncome}</p>
            <p>24小时收入: {analyticsData.incomeLast24h}</p>
          </div>
        </div>
      )}

      {testResult && (
        <div>
          <h2 className="text-xl font-bold mb-4">测试结果：</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
