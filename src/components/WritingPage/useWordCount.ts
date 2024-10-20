import { useState, useCallback, useEffect } from "react";

type Language = "en" | "cn" | "mixed";

export const useWordCount = (initialText: string = "", maxCount: number) => {
  const [text, setText] = useState(initialText);
  const [wordCount, setWordCount] = useState(0);
  const [language, setLanguage] = useState<Language>("en");

  const detectLanguage = useCallback((text: string): Language => {
    const chineseRegex =
      /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff]/;
    const englishRegex = /[a-zA-Z]/;

    const chineseCount = (text.match(chineseRegex) || []).length;
    const englishCount = (text.match(englishRegex) || []).length;

    if (chineseCount > 0 && englishCount > 0) {
      return "mixed";
    } else if (chineseCount > 0) {
      return "cn";
    } else {
      return "en";
    }
  }, []);

  const countWords = useCallback(
    (text: string): number => {
      const language = detectLanguage(text);

      // 移除所有空白字符
      const trimmedText = text.replace(/\s+/g, "");

      if (language === "cn" || language === "mixed") {
        // 对于中文和混合文本，按以下规则计数：
        // 1. 连续的字母算作一个单词
        // 2. 每个中文字符算作一个单词
        const segments =
          trimmedText.match(
            /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff]|[a-zA-Z]+/g
          ) || [];
        return segments.length;
      } else {
        // 对于英文，按单词计数
        const words = trimmedText
          .replace(/[^a-zA-Z0-9]+/g, " ")
          .trim()
          .split(/\s+/);
        return words.length > 0 ? words.length : 0;
      }
    },
    [detectLanguage]
  );

  useEffect(() => {
    const detectedLanguage = detectLanguage(text);
    setLanguage(detectedLanguage);
    setWordCount(countWords(text));
  }, [text, countWords, detectLanguage]);

  const handleTextChange = useCallback(
    (newText: string) => {
      const newCount = countWords(newText);
      if (newCount <= maxCount) {
        setText(newText);
      }
    },
    [countWords, maxCount]
  );

  return {
    text,
    wordCount,
    handleTextChange,
    language
  };
};
