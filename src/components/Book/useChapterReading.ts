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
  // 计算阅读进度
  const calculateReadingProgress = useCallback(() => {
    if (!contentRef.current) return 0;

    const element = contentRef.current;
    const totalHeight = element.scrollHeight - element.clientHeight;
    const scrolled = window.scrollY - element.offsetTop;
    const progress = (scrolled / totalHeight) * 100;

    return Math.min(100, Math.max(0, progress));
  }, [contentRef]);

  // 初始化阅读统计
  const { stats, updateProgress, pause, resume, resetStats } = useReadingStats({
    bookId: book.id,
    chapterId: chapter.id,
    totalWords: chapter.wordCount || 0,
    onReachTimeThreshold: () => {
      console.log("阅读时间达到3分钟");
      // 可以添加达到时间阈值的处理逻辑
    },
    onReachProgressThreshold: () => {
      console.log("阅读进度达到30%");
      // 可以添加达到进度阈值的处理逻辑
    }
  });

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    const progress = calculateReadingProgress();
    updateProgress(progress);
  }, [calculateReadingProgress, updateProgress]);

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
    resetStats();
  }, [chapter.id, resetStats]);

  return {
    stats,
    updateProgress,
    pause,
    resume
  };
};
