// mockData.ts

import {
  PurchaseOption,
  PurchaseHistory,
  DonationHistory
} from "@/app/lib/definitions";

// 模拟购买选项
export const mockPurchaseOptions: PurchaseOption[] = [
  { id: 1, coins: 10, price: 1 },
  { id: 2, coins: 100, price: 10 },
  { id: 3, coins: 1000, price: 100 },
  { id: 4, coins: 2000, price: 200 }
];

// 模拟购买历史
export const mockPurchaseHistory: PurchaseHistory[] = [
  { id: 1, userId: 1, coins: 500, amountPaid: 45, date: "2023-08-15" },
  { id: 2, userId: 1, coins: 1000, amountPaid: 80, date: "2023-07-28" },
  { id: 3, userId: 1, coins: 100, amountPaid: 10, date: "2023-07-10" }
];

// 模拟打赏历史
export const mockDonationHistory: DonationHistory[] = [
  {
    id: 1,
    userId: 1,
    authorId: 2,
    coins: 50,
    date: "2023-08-10",
    authorName: "知名作家A",
    bookTitle: "奇幻冒险",
    bookId: 101
  },
  {
    id: 2,
    userId: 1,
    authorId: 3,
    coins: 100,
    date: "2023-07-25",
    authorName: "畅销作家B",
    bookTitle: "都市爱情",
    bookId: 102
  },
  {
    id: 3,
    userId: 1,
    authorId: 4,
    coins: 30,
    date: "2023-07-05",
    authorName: "新锐作家C",
    bookTitle: "科幻世界",
    bookId: 103
  }
];

// 模拟用户余额
export const mockBalance: number = 1500;
