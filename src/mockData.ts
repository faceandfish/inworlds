// src/mocks/mockData.ts

import {
  UserInfo,
  BookInfo,
  Comment,
  IncomeData,
  SystemNotification,
} from "@/app/lib/definitions";

export const mockUser: UserInfo = {
  id: 1,
  name: "张三",
  authorname: "梦幻作家",
  loginAct: "zhangsan",
  introduction: "一个热爱写作的梦想家",
  email: "zhangsan@example.com",
  createdAt: "2023-01-01T00:00:00Z",
  articlesCount: 10,
  followersCount: 1000,
  followingCount: 50,
  favoritesCount: 30,
  articles: {
    items: [
      {
        id: "1",
        title: "我的第一本书",
        description: "这是我写的第一本书的简介",
        createdAt: "2023-06-01T00:00:00Z",
      },
      // 可以添加更多文章...
    ],
    page: 1,
  },
  followers: {
    items: [
      {
        id: "2",
        loginAct: "lisi",
        avatarFile: "/images/lisi-avatar.jpg",
      },
      // 可以添加更多粉丝...
    ],
  },
  following: {
    items: [
      {
        id: "3",
        loginAct: "wangwu",
        avatarFile: "/images/wangwu-avatar.jpg",
      },
      // 可以添加更多关注...
    ],
  },
  favorites: {
    items: [
      {
        id: "4",
        coverImage: null,
        title: "最喜欢的一本书",
      },
      // 可以添加更多收藏...
    ],
  },
};

export const mockBooks: BookInfo[] = [
  {
    id: 1,
    title: "星际冒险",
    description: "一个关于太空探索的惊心动魄的故事",
    category: "male-story",
    ageRating: "allAges",
    coverImage: null,
    content: "这是小说的内容...",
    authorNote: "希望读者能喜欢这个故事",
    wordCount: 100000,
    lastSaved: "2023-07-01T12:00:00Z",
    createdAt: "2023-06-01T00:00:00Z",
    onSaveDraft: () => console.log("保存草稿"),
    onPublish: () => console.log("发布小说"),
    updateSectionContent: (id: number, content: string) =>
      console.log(`更新章节 ${id} 内容`),
    status: false, // 假设未完结
    latestChapterNumber: 10,
    latestChapterTitle: "神秘的星球",
    chapters: [
      { id: 1, number: "第一章", title: "起航" },
      { id: 2, number: "第二章", title: "未知的信号" },
      { id: 3, number: "第三章", title: "惊险的相遇" },
      { id: 4, number: "第四章", title: "星际迷航" },
      { id: 5, number: "第五章", title: "神秘遗迹" },
      { id: 6, number: "第六章", title: "时空裂缝" },
      { id: 7, number: "第七章", title: "失落的文明" },
      { id: 8, number: "第八章", title: "星际联盟" },
      { id: 9, number: "第九章", title: "宇宙的秘密" },
      { id: 10, number: "第十章", title: "神秘的星球" },
    ],
  },
  {
    id: 2,
    title: "都市爱情",
    description: "一个温馨浪漫的都市爱情故事",
    category: "female-story",
    ageRating: "adult",
    coverImage: null,
    content: "这是小说的内容...",
    authorNote: "写给所有相信爱情的人",
    wordCount: 80000,
    lastSaved: "2023-07-15T14:30:00Z",
    createdAt: "2023-05-15T00:00:00Z",
    onSaveDraft: () => console.log("保存草稿"),
    onPublish: () => console.log("发布小说"),
    updateSectionContent: (id: number, content: string) =>
      console.log(`更新章节 ${id} 内容`),
    status: true, // 假设已完结
    latestChapterNumber: 20,
    latestChapterTitle: "幸福的未来",
    chapters: [
      { id: 1, number: "第一章", title: "初次相遇" },
      { id: 2, number: "第二章", title: "咖啡店的偶遇" },
      { id: 3, number: "第三章", title: "误会与和解" },
      { id: 4, number: "第四章", title: "共同的梦想" },
      { id: 5, number: "第五章", title: "感情的考验" },
      // ... 可以继续添加更多章节
      { id: 19, number: "第十九章", title: "真爱的力量" },
      { id: 20, number: "第二十章", title: "幸福的未来" },
    ],
  },
];

export const mockComments: Comment[] = [
  {
    id: 1,
    content: "这本书真的很精彩！",
    username: "读者A",
    createdAt: "2023-07-15T08:00:00Z",
    likes: 50,
    bookId: 1,
  },
  {
    id: 2,
    content: "期待作者的下一本书！",
    username: "读者B",
    createdAt: "2023-07-16T09:30:00Z",
    likes: 30,
    bookId: 1,
  },
  // 可以添加更多评论...
];

export const mockIncomeData: IncomeData = {
  totalIncome: 100000,
  adIncome: 50000,
  donationIncome: 30000,
  copyrightIncome: 20000,
  monthlyIncome: [
    { month: "2023-01", income: 8000 },
    { month: "2023-02", income: 8500 },
    { month: "2023-03", income: 9000 },
    { month: "2023-04", income: 9500 },
    { month: "2023-05", income: 10000 },
    { month: "2023-06", income: 10500 },
  ],
};

// 在文件末尾添加以下内容:

import { Conversation, Message } from "@/app/lib/definitions";

// 添加更多模拟用户
export const mockUsers: UserInfo[] = [
  mockUser,
  {
    id: 2,
    name: "李四",
    authorname: "科幻大师",
    loginAct: "lisi",
    introduction: "专注于科幻小说创作",
    email: "lisi@example.com",
    createdAt: "2023-02-01T00:00:00Z",
    articlesCount: 8,
    followersCount: 800,
    followingCount: 40,
    favoritesCount: 25,
  },
  {
    id: 3,
    name: "王五",
    authorname: "悬疑之王",
    loginAct: "wangwu",
    introduction: "善于创作悬疑推理小说",
    email: "wangwu@example.com",
    createdAt: "2023-03-01T00:00:00Z",
    articlesCount: 12,
    followersCount: 1200,
    followingCount: 60,
    favoritesCount: 35,
  },
];

// 添加系统通知的模拟数据
export const mockSystemNotifications: SystemNotification[] = [
  {
    id: 1,
    content: "欢迎使用我们的新消息系统！如有任何问题，请随时联系客服。",
    createdAt: "2024-08-01T10:00:00Z",
    isRead: false,
  },
  {
    id: 2,
    content: "系统将于下周进行维护升级，届时可能会有短暂服务中断。",
    createdAt: "2024-08-02T14:30:00Z",
    isRead: false,
  },
];

// 添加模拟会话数据
export const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [1, 2],
    lastMessage: {
      id: 1,
      senderId: 2,
      receiverId: 1,
      content: "嗨，张三！我看了你的新书，真的很棒！",
      createdAt: "2023-08-01T10:00:00Z",
    },
    unreadCount: 1,
    systemNotifications: mockSystemNotifications, // 添加系统通知到对话中
  },
  {
    id: 2,
    participants: [1, 3],
    lastMessage: {
      id: 2,
      senderId: 1,
      receiverId: 3,
      content: "王五，我们下周一开个作者交流会，你有空吗？",
      createdAt: "2023-08-02T14:30:00Z",
    },
    unreadCount: 0,
  },
];

// 添加模拟消息数据
export const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 2,
    receiverId: 1,
    content: "嗨，张三！我看了你的新书，真的很棒！",
    createdAt: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    senderId: 1,
    receiverId: 2,
    content: "谢谢李四！我很高兴你喜欢。你最近在写什么新作品吗？",
    createdAt: "2023-08-01T10:05:00Z",
  },
  {
    id: 3,
    senderId: 2,
    receiverId: 1,
    content: "是的，我正在构思一个新的科幻系列。有机会我们可以讨论一下。",
    createdAt: "2023-08-01T10:10:00Z",
  },
  {
    id: 4,
    senderId: 1,
    receiverId: 2,
    content: "那太好了！期待与你交流。",
    createdAt: "2023-08-01T10:15:00Z",
  },
  {
    id: 5,
    senderId: 1,
    receiverId: 3,
    content: "王五，我们下周一开个作者交流会，你有空吗？",
    createdAt: "2023-08-02T14:30:00Z",
  },
  {
    id: 6,
    senderId: 3,
    receiverId: 1,
    content: "好的，张三。我查看了日程，下周一下午有空。具体几点？",
    createdAt: "2023-08-02T15:00:00Z",
  },
];

// 获取当前用户的函数（这里假设当前用户是张三）
export const getCurrentUser = (): UserInfo => mockUsers[0];
// 更新或添加获取模拟数据的函数
export const getMockConversations = (): Conversation[] => {
  return mockConversations;
};
export const getMockSystemNotifications = (): SystemNotification[] => {
  return mockSystemNotifications;
};
