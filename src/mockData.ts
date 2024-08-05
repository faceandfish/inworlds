// src/mocks/mockData.ts

import {
  UserInfo,
  BookInfo,
  CommentInfo,
  IncomeData,
  SystemNotification,
  Conversation,
  Message,
  ArticleInfo,
  FavoriteInfo,
  ChapterInfo,
  CreatorUserInfo,
  RegularUserInfo,
} from "@/app/lib/definitions";

export const mockCreatorUser: CreatorUserInfo = {
  id: 1,
  username: "zhangsan",
  displayName: "张三",
  authorName: "梦幻作家",
  email: "zhangsan@example.com",
  avatarUrl: "/images/zhangsan-avatar.jpg",
  introduction: "一个热爱写作的梦想家",
  createdAt: "2023-01-01T00:00:00Z",
  userType: "creator",
  articlesCount: 10,
  followersCount: 1000,
  followingCount: 50,
  favoritesCount: 30,
};

export const mockRegularUser: RegularUserInfo = {
  id: 2,
  username: "lisi",
  displayName: "李四",
  email: "lisi@example.com",
  avatarUrl: "/images/lisi-avatar.jpg",
  introduction: "热爱阅读的普通用户",
  createdAt: "2023-02-01T00:00:00Z",
  userType: "regular",
};

export const mockArticles: ArticleInfo[] = [
  {
    id: "1",
    title: "我的第一本书",
    description: "这是我写的第一本书的简介",
    createdAt: "2023-06-01T00:00:00Z",
    authorId: 1,
    content: "这是文章的详细内容...",
    category: "fiction",
    tags: ["科幻", "冒险"],
  },
  // 可以添加更多文章...
];

export const mockFavorites: FavoriteInfo[] = [
  {
    id: "1",
    coverImageUrl: "/images/book-cover.jpg",
    title: "最喜欢的一本书",
    type: "book",
    creatorId: 1,
  },
  // 可以添加更多收藏...
];

export const mockBooks: BookInfo[] = [
  {
    id: 1,
    title: "星际冒险",
    authorName: "章鱼烧",
    description: "一个关于太空探索的惊心动魄的故事",
    category: "male-story",
    ageRating: "allAges",
    coverImageUrl: "/images/star-adventure-cover.jpg",
    authorNote: "希望读者能喜欢这个故事",
    wordCount: 100000,
    lastSaved: "2023-07-01",
    createdAt: "2023-06-01",
    status: "published",
    latestChapterNumber: 10,
    latestChapterTitle: "神秘的星球",
    authorId: 1,
    tags: ["科幻", "冒险", "太空"],
    followersCount: 100,
  },
  {
    id: 12,
    title: "吃完米粉",
    authorName: "章鱼烧",
    description: "一个关于太空探索的惊心动魄的故事",
    category: "male-story",
    ageRating: "allAges",
    coverImageUrl: "/images/star-adventure-cover.jpg",
    authorNote: "希望读者能喜欢这个故事",
    wordCount: 100000,
    lastSaved: "2023-07-01",
    createdAt: "2023-06-01",
    status: "published",
    latestChapterNumber: 10,
    latestChapterTitle: "神秘的星球",
    authorId: 1,
    tags: ["科幻", "冒险", "太空"],
    followersCount: 100,
  },
  {
    id: 121,
    title: "巴黎奥运会",
    authorName: "章鱼烧",
    description: "一个关于太空探索的惊心动魄的故事",
    category: "male-story",
    ageRating: "allAges",
    coverImageUrl: "/images/star-adventure-cover.jpg",
    authorNote: "希望读者能喜欢这个故事",
    wordCount: 100000,
    lastSaved: "2023-07-01",
    createdAt: "2023-06-01",
    status: "published",
    latestChapterNumber: 10,
    latestChapterTitle: "神秘的星球",
    authorId: 1,
    tags: ["科幻", "冒险", "太空"],
    followersCount: 100,
  },
  {
    id: 1222,
    title: "东京奥运会",
    authorName: "章鱼烧",
    description: "一个关于太空探索的惊心动魄的故事",
    category: "male-story",
    ageRating: "allAges",
    coverImageUrl: "/images/star-adventure-cover.jpg",
    authorNote: "希望读者能喜欢这个故事",
    wordCount: 100000,
    lastSaved: "2023-07-01",
    createdAt: "2023-06-01",
    status: "published",
    latestChapterNumber: 10,
    latestChapterTitle: "神秘的星球",
    authorId: 1,
    tags: ["科幻", "冒险", "太空"],
    followersCount: 100,
  },
  // 可以添加更多书籍...
];

export const mockChapters: ChapterInfo[] = [
  {
    id: 1,
    number: "第一章",
    title: "起航",
    content: `开卷第一回也。作者自云：曾历过一番梦幻之后，故将真事隐去，
而借通灵说此《石头记》一书也，故曰“甄士隐”云云。但书中所记何事何
人？自己又云：“今风尘碌碌，一事无成，忽念及当日所有之女子，一一细
考较去，觉其行止见识皆出我之上。我堂堂须眉诚不若彼裙钗，我实愧则有
馀，悔又无益，大无可如何之日也。当此日，欲将已往所赖天恩祖德，锦衣
纨袴之时，饫甘餍肥之日，背父兄教育之恩，负师友规训之德，以致今日一
技无成、半生潦倒之罪，编述一集，以告天下；知我之负罪固多，然闺阁中
历历有人，万不可因我之不肖，自护己短，一并使其泯灭也。所以蓬牖茅椽，
绳床瓦灶，并不足妨我襟怀；况那晨风夕月，阶柳庭花，更觉得润人笔墨。
我虽不学无文，又何妨用假语村言敷演出来？亦可使闺阁昭传。复可破一时
之闷，醒同人之目，不亦宜乎？”故曰“贾雨村”云云。更于篇中间用“梦”
“幻”等字，却是此书本旨，兼寓提醒阅者之意。
看官你道此书从何而起？说来虽近荒唐，细玩颇有趣味。却说那女娲氏
炼石补天之时，于大荒山无稽崖炼成高十二丈、见方二十四丈大的顽石三万
六千五百零一块。那娲皇只用了三万六千五百块，单单剩下一块未用，弃在
青埂峰下。谁知此石自经锻炼之后，灵性已通，自去自来，可大可小。因见
众石俱得补天，独自己无才不得入选，遂自怨自愧，日夜悲哀。一日正当嗟
悼之际，俄见一僧一道远远而来，生得骨格不凡，丰神迥异，来到这青埂峰
下，席地坐谈。见着这块鲜莹明洁的石头，且又缩成扇坠一般，甚属可爱。
那僧托于掌上，笑道：“形体倒也是个灵物了，只是没有实在的好处。须得
再镌上几个字，使人人见了便知你是件奇物，然后携你到那昌明隆盛之邦、
诗礼簪缨之族、花柳繁华地、温柔富贵乡那里去走一遭。”石头听了大喜，
因问：“不知可镌何字？携到何方？望乞明示。”那僧笑道：“你且莫问，日
后自然明白。”说毕，便袖了，同那道人飘然而去，竟不知投向何方。
又不知过了几世几劫，因有个空空道人访道求仙，从这大荒山无稽崖青
埂峰下经过。忽见一块大石，上面字迹分明，编述历历。空空道人乃从头一
看，原来是无才补天、幻形入世，被那茫茫大士、渺渺真人携入红尘、引登
彼岸的一块顽石；上面叙着堕落之乡、投胎之处，以及家庭琐事、闺阁闲情、
诗词谜语，倒还全备。只是朝代年纪，失落无考。后面又有一偈云：
无才可去补苍天，枉入红尘若许年。此系身前身后事，倩谁记去作奇传？
空空道人看了一回，晓得这石头有些来历，遂向石头说道：“石兄，你
这一段故事，据你自己说来，有些趣味，故镌写在此，意欲闻世传奇。据我
看来：第一件，无朝代年纪可考；第二件，并无大贤大忠、理朝廷、治风俗
的善政，其中只不过几个异样女子，或情或痴，或小才微善。我纵然抄去，
也算不得一种奇书。”石头果然答道：“我师何必太痴！我想历来野史的朝代，
无非假借汉、唐的名色；莫如我这石头所记不借此套，只按自己的事体情理，
反倒新鲜别致。况且那野史中，或讪谤君相，或贬人妻女，奸淫凶恶，不可
胜数；更有一种风月笔墨，其淫秽污臭最易坏人子弟。至于才子佳人等书，
则又开口‘文君’，满篇‘子建’，千部一腔，千人一面，且终不能不涉淫滥。
在作者不过要写出自己的两首情诗艳赋来，故假捏出男女二人名姓；又必旁
添一小人拨乱其间，如戏中的小丑一般。更可厌者，‘之乎者也’，非理即文，
大不近情，自相矛盾。竟不如我这半世亲见亲闻的几个女子，虽不敢说强似
`,
    createdAt: "2023-06-01",
    lastModified: "2023-06-02",
    wordCount: 3000,
  },
  {
    id: 2,
    number: "第二章",
    title: "起航",
    content: "这是第一章的内容...",
    createdAt: "2023-06-01T00:00:00Z",
    lastModified: "2023-06-02T10:00:00Z",
    wordCount: 3000,
  },
  {
    id: 3,
    number: "第三章",
    title: "起航",
    content: "这是第一章的内容...",
    createdAt: "2023-06-01T00:00:00Z",
    lastModified: "2023-06-02T10:00:00Z",
    wordCount: 3000,
  },
  {
    id: 4,
    number: "第四章",
    title: "起航",
    content: "这是第一章的内容...",
    createdAt: "2023-06-01T00:00:00Z",
    lastModified: "2023-06-02T10:00:00Z",
    wordCount: 3000,
  },
  // 可以添加更多章节...
];

export const mockComments: CommentInfo[] = [
  {
    id: 1,
    content: "这本书真的很精彩！",
    username: "读者A",
    createdAt: "2023-07-15T08:00:00Z",
    likes: 50,
    bookId: 1,
    userId: 2,
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
  currency: "CNY",
};

export const mockSystemNotifications: SystemNotification[] = [
  {
    id: 1,
    content: "欢迎使用我们的新消息系统！如有任何问题，请随时联系客服。",
    createdAt: "2024-08-01T10:00:00Z",
    isRead: false,
    type: "info",
  },
  {
    id: 2,
    content: "系统将于下周进行维护升级，届时可能会有短暂服务中断。",
    createdAt: "2024-08-02T14:30:00Z",
    isRead: false,
    type: "warning",
  },
];

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
      isRead: false,
    },
    unreadCount: 1,
    systemNotifications: mockSystemNotifications,
    createdAt: "2023-08-01T10:00:00Z",
  },
  // 可以添加更多对话...
];

export const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 2,
    receiverId: 1,
    content: "嗨，张三！我看了你的新书，真的很棒！",
    createdAt: "2023-08-01T10:00:00Z",
    isRead: false,
  },
  {
    id: 2,
    senderId: 1,
    receiverId: 2,
    content: "谢谢李四！我很高兴你喜欢。你最近在读什么新书吗？",
    createdAt: "2023-08-01T10:05:00Z",
    isRead: true,
  },
  // 可以添加更多消息...
];

// 获取当前用户的函数（这里假设当前用户是张三）
export const getCurrentUser = (): UserInfo => mockCreatorUser;

// 获取模拟数据的函数
export const getMockConversations = (): Conversation[] => mockConversations;
export const getMockSystemNotifications = (): SystemNotification[] =>
  mockSystemNotifications;
export const getMockBooks = (): BookInfo[] => mockBooks;
export const getMockArticles = (): ArticleInfo[] => mockArticles;
export const getMockComments = (): CommentInfo[] => mockComments;
export const getMockIncomeData = (): IncomeData => mockIncomeData;
export const getMockChapters = (): ChapterInfo[] => mockChapters;
