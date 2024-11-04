// hooks/useReadingStats.ts
import { ReadingStats } from "@/app/lib/definitions";
import { useState, useEffect, useCallback, useRef } from "react";
import { updateReadingStats, getReadingProgress } from "@/app/lib/action";

interface UseReadingStatsProps {
  bookId: number;
  chapterId: number;
  totalWords: number;
  onReachTimeThreshold?: () => void;
  onReachProgressThreshold?: () => void;
}

const MAX_READ_SPEED = 1000; // 最快每分钟1000字
const MIN_READ_SPEED = 200; // 最慢每分钟200字

const useReadingStats = ({
  bookId,
  chapterId,
  totalWords,
  onReachTimeThreshold,
  onReachProgressThreshold
}: UseReadingStatsProps) => {
  const [stats, setStats] = useState<ReadingStats>({
    bookId,
    chapterId,
    startTime: Date.now(),
    activeTime: 0,
    readingProgress: 0,
    totalWords,
    isActive: true
  });

  const lastUpdateRef = useRef<number>(Date.now());
  const thresholdsRef = useRef({
    timeThresholdReached: false,
    progressThresholdReached: false
  });

  const statsRef = useRef(stats);
  statsRef.current = stats;

  const callbacksRef = useRef({
    onReachTimeThreshold,
    onReachProgressThreshold
  });

  useEffect(() => {
    callbacksRef.current = {
      onReachTimeThreshold,
      onReachProgressThreshold
    };
  }, [onReachTimeThreshold, onReachProgressThreshold]);

  // 获取历史阅读进度
  useEffect(() => {
    const fetchReadingProgress = async () => {
      try {
        const response = await getReadingProgress(bookId, chapterId);
        if (response.data) {
          setStats((prev) => ({
            ...prev,
            activeTime: response.data.activeTime,
            readingProgress: response.data.readingProgress
          }));

          // 如果有历史阅读记录，更新阈值状态
          if (response.data.activeTime >= 3 * 60 * 1000) {
            thresholdsRef.current.timeThresholdReached = true;
          }
          if (response.data.readingProgress >= 30) {
            thresholdsRef.current.progressThresholdReached = true;
          }
        }
      } catch (error) {
        console.error("Failed to fetch reading progress:", error);
      }
    };

    fetchReadingProgress();
  }, [bookId, chapterId]);

  // 同步数据到后端
  const syncStats = useCallback(async () => {
    const currentStats = statsRef.current;
    if (currentStats.activeTime > 0 || currentStats.readingProgress > 0) {
      const minValidTime =
        (currentStats.totalWords / MAX_READ_SPEED) * 60 * 1000;
      const maxValidTime =
        (currentStats.totalWords / MIN_READ_SPEED) * 60 * 1000;

      const isValidReadingTime =
        currentStats.activeTime >= minValidTime &&
        (currentStats.activeTime <= maxValidTime ||
          currentStats.readingProgress < 95);

      try {
        await updateReadingStats({
          ...currentStats,
          isValidReading: isValidReadingTime
        });
      } catch (error) {
        console.error("Failed to sync reading stats:", error);
      }
    }
  }, []); // 移除所有依赖

  // 定期同步数据
  useEffect(() => {
    const intervalId = setInterval(syncStats, 30000);

    return () => {
      clearInterval(intervalId);
      syncStats();
    };
  }, [syncStats]);

  // 更新活跃时间
  const updateActiveTime = useCallback(() => {
    const currentStats = statsRef.current;
    if (!currentStats.isActive) return;

    const now = Date.now();
    const timeDiff = now - lastUpdateRef.current;

    if (timeDiff < 30000) {
      setStats((prev) => ({
        ...prev,
        activeTime: prev.activeTime + timeDiff
      }));
    }

    lastUpdateRef.current = now;
  }, []); // 移除依赖

  // 处理页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      setStats((prev) => ({
        ...prev,
        isActive: isVisible
      }));

      if (isVisible) {
        lastUpdateRef.current = Date.now();
      } else {
        updateActiveTime();
        syncStats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateActiveTime, syncStats]);

  // 定期更新活跃时间
  useEffect(() => {
    if (!statsRef.current.isActive) return;

    const intervalId = setInterval(updateActiveTime, 1000);
    return () => clearInterval(intervalId);
  }, [updateActiveTime]);

  // 检查阈值并同步数据
  useEffect(() => {
    let shouldSync = false;

    if (
      !thresholdsRef.current.timeThresholdReached &&
      stats.activeTime >= 3 * 60 * 1000
    ) {
      thresholdsRef.current.timeThresholdReached = true;
      callbacksRef.current.onReachTimeThreshold?.();
      shouldSync = true;
    }

    if (
      !thresholdsRef.current.progressThresholdReached &&
      stats.readingProgress >= 30
    ) {
      thresholdsRef.current.progressThresholdReached = true;
      callbacksRef.current.onReachProgressThreshold?.();
      shouldSync = true;
    }

    if (shouldSync) {
      syncStats();
    }
  }, [stats.activeTime, stats.readingProgress]);

  const updateProgress = useCallback((scrollPercent: number) => {
    setStats((prev) => ({
      ...prev,
      readingProgress: Math.min(100, Math.max(0, scrollPercent))
    }));
  }, []);

  const resetStats = useCallback(() => {
    syncStats();

    setStats({
      bookId,
      chapterId,
      startTime: Date.now(),
      activeTime: 0,
      readingProgress: 0,
      totalWords,
      isActive: true
    });
    lastUpdateRef.current = Date.now();
    thresholdsRef.current = {
      timeThresholdReached: false,
      progressThresholdReached: false
    };
  }, [bookId, chapterId, totalWords, syncStats]);

  const pause = useCallback(() => {
    updateActiveTime();
    syncStats();
    setStats((prev) => ({
      ...prev,
      isActive: false
    }));
  }, [updateActiveTime, syncStats]);

  const resume = useCallback(() => {
    lastUpdateRef.current = Date.now();
    setStats((prev) => ({
      ...prev,
      isActive: true
    }));
  }, []);

  return {
    stats,
    updateProgress,
    resetStats,
    pause,
    resume
  };
};

export default useReadingStats;
