// hooks/useChapterReading.ts
import { useEffect, useRef, useCallback } from "react";

import type { ChapterInfo, BookInfo } from "@/app/lib/definitions";
import useReadingStats from "../Main/useReadingStats";

interface UseChapterReadingProps {
  chapter: ChapterInfo;
  book: BookInfo;
  contentRef: React.RefObject<HTMLDivElement>;
}

export const useChapterReading = ({
  chapter,
  book,
  contentRef
}: UseChapterReadingProps) => {
  // 使用 useRef 来存储不需要触发重渲染的值
  const statsRef = useRef({
    bookId: book.id,
    chapterId: chapter.id,
    totalWords: chapter.wordCount || 0
  });

  // 使用 useCallback 包装回调函数，避免重复创建
  const handleTimeThreshold = useCallback(() => {
    console.log("阅读时间达到3分钟");
  }, []);

  const handleProgressThreshold = useCallback(() => {
    console.log("阅读进度达到30%");
  }, []);

  // 初始化阅读统计
  const { stats, updateProgress, pause, resume, resetStats } = useReadingStats({
    bookId: statsRef.current.bookId,
    chapterId: statsRef.current.chapterId,
    totalWords: statsRef.current.totalWords,
    onReachTimeThreshold: handleTimeThreshold,
    onReachProgressThreshold: handleProgressThreshold
  });

  // 计算阅读进度
  const calculateReadingProgress = useCallback(() => {
    if (!contentRef.current) return 0;

    const element = contentRef.current;
    const totalHeight = element.scrollHeight - element.clientHeight;
    const scrolled = window.scrollY - element.offsetTop;
    const progress = (scrolled / totalHeight) * 100;

    return Math.min(100, Math.max(0, progress));
  }, []); // 移除 contentRef 依赖

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    const progress = calculateReadingProgress();
    if (progress !== stats.readingProgress) {
      updateProgress(progress);
    }
  }, [calculateReadingProgress, updateProgress, stats.readingProgress]);

  // 监听滚动事件
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 处理页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resume();
      } else {
        pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pause, resume]);

  // 切换章节时重置阅读统计
  useEffect(() => {
    statsRef.current = {
      bookId: book.id,
      chapterId: chapter.id,
      totalWords: chapter.wordCount || 0
    };
    resetStats();
  }, [book.id, chapter.id, chapter.wordCount, resetStats]);

  return {
    stats,
    updateProgress,
    pause,
    resume
  };
};
