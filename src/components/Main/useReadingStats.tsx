// hooks/Main/useReadingStats.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { ReadingStats } from "@/app/lib/definitions";
import { updateReadingStats } from "@/app/lib/action";

interface UseReadingStatsProps {
  bookId: number;
  chapterId: number;
  totalWords: number;
  onReachTimeThreshold?: () => void;
  onReachProgressThreshold?: () => void;
}

const TIME_THRESHOLD = 3 * 60;
const PROGRESS_THRESHOLD = 30;
const UPDATE_INTERVAL = 10000;

export default function useReadingStats({
  bookId,
  chapterId,
  totalWords,
  onReachTimeThreshold,
  onReachProgressThreshold
}: UseReadingStatsProps) {
  const statsRef = useRef<ReadingStats>({
    bookId,
    chapterId,
    startTime: Date.now(),
    activeTime: 0,
    readingProgress: 0,
    totalWords,
    isActive: true
  });

  const [stats, setStats] = useState<ReadingStats>(statsRef.current);

  const timer = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTime = useRef<number>(Date.now());
  const reachedTimeThreshold = useRef<boolean>(false);
  const reachedProgressThreshold = useRef<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const isActiveRef = useRef(true);

  // 更新统计数据到服务器
  const syncToServer = useCallback(async () => {
    if (!isMounted.current) return;

    const currentTime = Date.now();
    const timeElapsed = Math.floor(
      (currentTime - lastUpdateTime.current) / 1000
    );

    // 如果时间间隔太短，跳过更新
    if (timeElapsed < 1) return;

    const currentStats = statsRef.current;

    const isValidReading =
      currentStats.activeTime >= TIME_THRESHOLD ||
      currentStats.readingProgress >= PROGRESS_THRESHOLD;

    console.log("准备同步数据到服务器:", {
      currentStats,
      timeElapsed,
      isValidReading
    });

    try {
      const updatedStats = {
        ...currentStats,
        activeTime: currentStats.activeTime + timeElapsed,
        isValidReading
      };
      console.log("发送到服务器的数据:", updatedStats);
      await updateReadingStats(updatedStats);
      lastUpdateTime.current = currentTime;
    } catch (error) {
      console.error("Failed to sync reading stats:", error);
    }
  }, []);

  // 更新本地状态
  const updateLocalStats = useCallback(
    (updater: (prev: ReadingStats) => ReadingStats) => {
      setStats((prev) => {
        const newStats = updater(prev);
        statsRef.current = newStats;
        isActiveRef.current = newStats.isActive;
        return newStats;
      });
    },
    []
  );

  // 启动定时器
  const startTimer = useCallback(() => {
    if (timer.current) return;

    timer.current = setInterval(() => {
      if (!isMounted.current) {
        clearInterval(timer.current!);
        timer.current = null;
        return;
      }

      const timeIncrement = UPDATE_INTERVAL / 1000;

      updateLocalStats((prev) => {
        const newActiveTime = prev.activeTime + timeIncrement;
        if (!reachedTimeThreshold.current && newActiveTime >= TIME_THRESHOLD) {
          reachedTimeThreshold.current = true;
          onReachTimeThreshold?.();
        }
        return {
          ...prev,
          activeTime: newActiveTime
        };
      });

      syncToServer();
    }, UPDATE_INTERVAL);
  }, [onReachTimeThreshold, syncToServer, updateLocalStats]);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const updateProgress = useCallback(
    (progress: number) => {
      if (!isMounted.current) return;

      updateLocalStats((prev) => {
        if (
          !reachedProgressThreshold.current &&
          progress >= PROGRESS_THRESHOLD
        ) {
          reachedProgressThreshold.current = true;
          onReachProgressThreshold?.();
        }
        return {
          ...prev,
          readingProgress: progress
        };
      });
    },
    [onReachProgressThreshold, updateLocalStats]
  );

  const pause = useCallback(() => {
    stopTimer();
    updateLocalStats((prev) => ({ ...prev, isActive: false }));
    syncToServer();
  }, [stopTimer, syncToServer, updateLocalStats]);

  const resume = useCallback(() => {
    if (!isMounted.current) return;
    updateLocalStats((prev) => ({ ...prev, isActive: true }));
    startTimer();
  }, [startTimer, updateLocalStats]);

  const resetStats = useCallback(() => {
    const shouldSync =
      statsRef.current.activeTime > 0 || statsRef.current.readingProgress > 0;

    stopTimer();
    if (shouldSync) {
      syncToServer();
    }

    if (!isMounted.current) return;

    const newStats = {
      bookId,
      chapterId,
      startTime: Date.now(),
      activeTime: 0,
      readingProgress: 0,
      totalWords,
      isActive: true
    };

    statsRef.current = newStats;
    setStats(newStats);

    lastUpdateTime.current = Date.now();
    reachedTimeThreshold.current = false;
    reachedProgressThreshold.current = false;
    startTimer();
  }, [bookId, chapterId, totalWords, stopTimer, startTimer, syncToServer]);

  useEffect(() => {
    isMounted.current = true;

    // 使用 ref 而不是 stats.isActive
    if (isActiveRef.current) {
      startTimer();
    }

    return () => {
      isMounted.current = false;
      stopTimer();
      const shouldSync =
        statsRef.current.activeTime > 0 || statsRef.current.readingProgress > 0;
      if (shouldSync) {
        syncToServer();
      }
    };
  }, [startTimer, stopTimer, syncToServer]);

  return {
    stats,
    updateProgress,
    pause,
    resume,
    resetStats
  };
}
