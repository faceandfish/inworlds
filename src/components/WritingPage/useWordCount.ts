import { useState, useCallback, useEffect } from "react";

type Language = "en" | "cn" | "jp" | "mixed";

export const useWordCount = (
  initialText: string | null | undefined = "",
  maxCount: number
) => {
  const [text, setText] = useState(initialText || "");
  const [wordCount, setWordCount] = useState(0);
  const [language, setLanguage] = useState<Language>("en");
  const [isMaxLength, setIsMaxLength] = useState(false);

  // 检测语言类型
  const detectLanguage = useCallback((text: string): Language => {
    if (!text || text.trim() === "") return "en";
    const chineseRegex = /[\u4e00-\u9fa5]/;
    const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
    const englishRegex = /[a-zA-Z]/;

    const chineseCount = (text.match(chineseRegex) || []).length;
    const japaneseCount = (text.match(japaneseRegex) || []).length;
    const englishCount = (text.match(englishRegex) || []).length;

    if (japaneseCount > 0 && (chineseCount > 0 || englishCount > 0)) {
      return "mixed";
    } else if (chineseCount > 0 && englishCount > 0) {
      return "mixed";
    } else if (japaneseCount > 0) {
      return "jp";
    } else if (chineseCount > 0) {
      return "cn";
    } else {
      return "en";
    }
  }, []);

  // 修正后的计算字数逻辑
  const countWords = useCallback(
    (text: string | null | undefined): number => {
      if (!text || text.trim() === "") return 0;
      const language = detectLanguage(text);

      if (language === "jp") {
        // 日语：匹配平假名、片假名、汉字和数字
        const chars =
          text.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fa5]|\d/g) || [];
        return chars.length;
      } else if (language === "cn" || language === "mixed") {
        // 中文：匹配每个汉字
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];

        // 匹配数字（每个数字都计数）
        const numbers = text.match(/\d/g) || [];

        // 英文：将所有非英文字母的字符替换为空格
        const englishText = text
          .replace(/[\u4e00-\u9fa5]/g, " ") // 移除中文字符
          .replace(/\d/g, " ") // 移除数字（因为已经单独计算）
          .replace(/[^a-zA-Z\s]/g, " "); // 移除所有非英文字母和空格的字符

        // 匹配英文单词（去除空字符串）
        const englishWords = englishText
          .split(/\s+/)
          .filter((word) => /^[a-zA-Z]+$/.test(word));

        // 汉字 + 数字 + 英文单词
        return chineseChars.length + numbers.length + englishWords.length;
      } else {
        // 纯英文模式下的数字处理
        const numbers = text.match(/\d/g) || [];
        const cleanText = text
          .replace(/\d/g, " ") // 移除数字（因为已经单独计算）
          .replace(/[^a-zA-Z\s]/g, " ");
        const words = cleanText
          .split(/\s+/)
          .filter((word) => /^[a-zA-Z]+$/.test(word));
        return words.length + numbers.length;
      }
    },
    [detectLanguage]
  );

  useEffect(() => {
    if (!text) {
      // 添加这行
      setWordCount(0); // 添加这行
      setIsMaxLength(false); // 添加这行
      return; // 添加这行
    }
    const detectedLanguage = detectLanguage(text);
    setLanguage(detectedLanguage);
    const newWordCount = countWords(text);
    setWordCount(newWordCount);
    setIsMaxLength(newWordCount >= maxCount);
  }, [text, countWords, detectLanguage, maxCount]);

  const handleTextChange = useCallback(
    (newText: string | null | undefined) => {
      const safeNewText = newText || ""; // 安全地处理输入
      const currentLength = text?.length || 0; // 使用可选链和默认值
      const newCount = countWords(safeNewText); // 已经是安全的文本

      if (newCount <= maxCount || safeNewText.length <= currentLength) {
        // 使用安全的文本比较
        setText(safeNewText); // 保存安全的文本
        setIsMaxLength(newCount >= maxCount);
      }
    },
    [countWords, maxCount, text]
  );

  return {
    text: text || "",
    wordCount: Math.max(0, wordCount),
    language,
    handleTextChange,
    isMaxLength: Boolean(isMaxLength),
    countWords
  };
};
