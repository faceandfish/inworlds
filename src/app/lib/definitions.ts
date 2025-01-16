import { Locale } from "../i18n-config";

// 文件上传接口
export interface FileUploadData {
  coverImage?: File | null;
  avatarImage?: File | null;
}

// 可公开的用户信息
export interface PublicUserInfo {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  introduction?: string;
  createdAt: string;
  userType: "creator" | "regular";
  booksCount?: number; // 只有当 userType 为 'creator' 时才有意义
  followersCount: number;
  followingCount: number;
  favoritesCount: number;
}

// 基础用户信息
export interface UserInfo {
  id: number;
  username: string;
  displayName?: string;
  email: string;
  emailVerified: Date | null;
  avatarUrl: string | null;
  introduction?: string;
  createdAt: string;
  phone?: string;
  language?: Locale;
  gender?: "male" | "female" | "other";
  birthDate?: string;
  followersCount: number;
  followingCount: number;
  favoritesCount: number;
  userType: "regular" | "creator";
  articlesCount?: number; // 只有当 userType 为 'creator' 时才有意义
  booksCount?: number; // 只有当 userType 为 'creator' 时才有意义
  totalIncome?: number;
}

// 用于创建新用户的接口
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  rePassword: string;
  displayName?: string;
  introduction?: string;
}

// 用于用户登录的接口
export interface LoginRequest {
  username: string;
  password: string;
}

// 用于更新用户信息的接口
export interface UpdateUserRequest {
  displayName?: string;
  email?: string;
  introduction?: string;
  phone?: string; // 可选字段，因为可能不是所有用户都有手机号
  language?: Locale;
  gender?: "male" | "female" | "other"; // 性别
  birthDate?: string; // 出生日期，格式为 ISO 8601 字符串，如 "1990-01-01"
}

// 用于更改密码的接口
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 用户关系信息
export interface UserRelationInfo {
  id: string;
  username: string;
  avatarUrl: string | null;
  relationshipType: "follower" | "following";
}

// 收藏信息
export interface FavoriteInfo {
  id: string;
  coverImageUrl: string;
  title: string;
  authorId: number; // 创作者ID
  authorName: string; // 创作者名字
  lastUpdated: string; // 最后更新时间
  status: "ongoing" | "completed";
}

// 分页数据
export interface PaginatedData<T> {
  currentPage: number; // 当前页码
  pageSize: number; // 每页数据量
  totalPage: number; // 总页数
  totalRecord: number; // 总记录数
  dataList: T[]; // 当前页的数据列表
}

// 图片上传请求
export interface ImageUploadRequest {
  file: File;
  type: "avatar" | "bookCover";
}

// 图片上传响应
export interface ImageUploadResponse {
  url: string;
  fileId: string; // 可能需要的文件标识符
}

// 章节信息
export interface ChapterInfo {
  id: number;
  bookId: number; // 添加这个字段来关联到特定的书
  chapterNumber?: number; // 添加章节序号
  title: string;
  content: string;
  createdAt: string;
  lastModified: string;
  wordCount?: number;
  authorNote?: string;
  publishStatus: "draft" | "published"; // 新增：章节的发布状态
  publishDate?: string; //"scheduled"定时发布时间确定
  // 新增: 表示章节是否收费
  isPaid: boolean;
  // 新增: 如果收费，表示收费金额（单位：金币）
  price: number;

  income24h: number; // 24小时收入
  totalIncome: number; // 总收入
  donationIncome: number; // 打赏收入
}

// 书籍信息
export interface BookInfo {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorIntroduction?: string;
  authorId: number; // 添加作者ID
  authorAvatarUrl: string;
  authorFollowersCount?: number;

  category:
    | "female-story"
    | "male-story"
    | "children-story"
    | "literature-story"
    | "personal-story";
  ageRating: "under18" | "adult" | "allAges";
  coverImageUrl?: string;

  totalWordCount?: number;
  lastSaved?: string;
  createdAt?: string;
  latestChapterNumber: number; //最新章节的编号
  latestChapterTitle: string; //最新章节的标题

  tags?: string; // 可选的标签
  favoritesCount?: number; //收藏本书的人数
  commentsCount?: number; //新增评论数总数
  chapters?: ChapterInfo[];

  status: "ongoing" | "completed"; // 书籍的连载状态：连载中或已完结
  publishStatus: "draft" | "published"; // 书籍的发布状态：草稿（仅作者可见）或已发布（所有人可见）
  views: number;
  income24h: number; // 24小时总收入
  totalIncome: number; // 总收入
  donationIncome: number; // 总打赏收入
  adIncome: number; // 广告收入（如果适用）
  monthlyIncome: { month: string; income: number }[]; // 按月收入统计
}

// 评论信息
export interface CommentInfo {
  id: number;
  bookCoverUrl: string;
  bookTitle: string;
  content: string;
  replyCount: number;
  username: string;
  createdAt: string;
  isLiked: boolean;
  likes: number;
  bookId: number;
  parentCommentId?: number; // 用于回复功能
  userId: number; // 评论者ID
  avatarUrl: string;
  replies?: CommentInfo[]; // 直接回复的数组
}

export interface LikeResponse {
  isLiked: boolean;
  likes: number;
}

export interface IncomeBookInfo {
  id: number;
  title: string;
  category: string;
  income24h: number;
  donationIncome: number;
  createdAt: string;
  chapterIncome: number;
  bookTotalIncome: number;
}
// 定义分析数据接口
export interface AnalyticsData {
  bookId: number;
  views: number;
  viewsLast24h: number;
  likes: number;
  comments: number;
  totalIncome: number;
  incomeLast24h: number;
}

// API 响应接口
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface ApiErrorResponse {
  code: number;
  msg: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface PasswordChangeResponse {
  code: number;
  msg: string;
  data: void | null;
}

// 登录凭证
export interface LoginCredentials {
  username: string;
  password: string;
}

// 注册凭证
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  rePassword: string;
}

// 更新用户资料凭证
export interface UpdateProfileCredentials {
  id: number;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
  introduction?: string;
  avatarImage?: File | null;
  avatarUrl: string | null;
}

// 消息系统相关接口
export interface SystemNotification {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  type: "info" | "warning" | "error"; // 添加通知类型
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isRead: boolean; // 添加已读状态
}

export interface Conversation {
  id: number;
  participants: number[];
  lastMessage: Message;
  unreadCount: number;
  systemNotifications?: SystemNotification[];
  createdAt: string; // 添加对话创建时间
}

export interface MessagingState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  systemNotifications: SystemNotification[];
}

export interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  content: string;
}

// 搜索请求接口

export interface SearchResult {
  books: BookInfo[];
  users: PublicUserInfo[];
}

// 打赏接口
export interface SponsorInfo {
  userId: number;
  userName: string;
  displayName: string;
  avatarUrl: string;
  createAt: string;
  coins: number;
  offCoins: number;
}

//打赏
export interface PurchaseOption {
  id: number;
  coins: number;
  price: number; // 真实价钱
}

export interface PurchaseHistory {
  id: number;
  userId: number;
  coins: number;
  amount: number;
  createAt: string;
}

export interface DonationHistory {
  id: number;
  userId: number; // 添加用户ID
  authorId: number; // 添加作者ID
  coins: number;
  createAt: string;
  authorName: string;
  bookTitle: string;
  bookId: number;
}

//paypal order
export interface PayPalOrderRequest {
  amount: string;
  currency: string;
  description: string;
}

// Define the PayPal order response type
export interface PayPalOrderResponse {
  orderId: string;
  paymentUrl: string;
}

export interface ConfirmPayPalOrderRequest {
  orderId: string;
}

export interface ConfirmPayPalOrderResponse {
  orderId: string; //使用PayPal返回的支付ID。
  payerId: string; //来自支付者信息中的payer_id。
  saleId: string; //使用具体销售交易的ID。
  amount: string; //交易的总金额
  currency: string; //交易的货币单位
}

export interface UserBalance {
  availableBalance: number;
}

export type TranslationFunction = (
  key: string,
  params?: Record<string, any>
) => string;

export interface UseTranslationResponse {
  t: TranslationFunction;
}

export interface ChapterPaymentResponse {
  chapterId: number;
  coinsPaid: number;
  newBalance: number;
}

export interface TipResponse {
  authorId: number;
  authorName: string;
  coins: number;
  newBalance: number;
  bookId?: number;
  bookTitle?: string;
  chapterId?: number;
}

export interface PurchasedChapterInfo {
  bookId: number;
  chapterId: number;
  chapterTitle: string;
  chapterNumber: number;
  bookTitle: string;
  authorId: number;
  authorName: string;
  createAt: string;
  coinsPaid: number;
}

export interface SearchHistoryItem {
  id: number;
  userId: number;
  keyword: string;
  createAt: string;
}

export interface ReadingStats {
  bookId: number; // 添加 bookId
  chapterId: number;
  startTime: number; // 开始阅读时间
  activeTime: number; // 有效阅读时间(累计)
  readingProgress: number; // 阅读进度(0-100)
  totalWords: number; // 总字数
  isActive: boolean; // 是否正在阅读
  isValidReading?: boolean; // 新增字段,表示阅读时间是否在合理范围内
}

export interface TransferToWalletResponse {
  newBalance: number; // 更新后的工作室余额
  newWalletBalance: number; // 更新后的钱包余额
}

export interface TransferRecord {
  id: number;
  amount: number;
  status: "success" | "failed" | "pending";
  createAt: string;
}

export interface PaginatedTransferRecords {
  dataList: TransferRecord[];
  totalPage: number;
  currentPage: number;
}

// definitions.ts 中添加以下接口

// 银行卡信息接口
export interface BankCard {
  id: string;
  userId: number;
  bankName: string;
  cardNumber: string;
  holderName: string;
  isDefault: boolean;
  createAt: string;
  lastUsed: string;
  country?: string;
  swiftCode?: string;
  bankAddress?: string;
}
// 新增银行卡请求接口
export interface AddBankCardRequest {
  bankName: string;
  cardNumber: string;
  holderName: string;
  isDefault: boolean;
  country: string;
  swiftCode?: string; // 可选的，用于国际转账
  bankAddress?: string;
}

// 提现请求接口
export interface WithdrawRequest {
  amount: number; // USD金额
  inkAmount: number; // 墨币数量
  bankCardId: string; // 银行卡ID
}

// 提现记录接口
export interface WithdrawRecord {
  id: string;
  userId: number;
  amount: number; // USD金额
  inkAmount: number; // 墨币数量
  bankCardId: string;
  bankName: string;
  cardNumber: string; // 部分隐藏的卡号
  status: "pending" | "processing" | "completed" | "failed";
  createAt: string;
  completedAt?: string;
  failReason?: string;
}

// 提现响应接口
export interface WithdrawResponse {
  withdrawId: string;
  status: "pending" | "processing" | "completed" | "failed";
  remainingBalance: number; // 剩余墨币数量
}

// 银行卡列表响应
export interface PaginatedBankCards {
  dataList: BankCard[];
  totalPage: number;
  currentPage: number;
}

// 提现记录列表响应
export interface PaginatedWithdrawRecords {
  dataList: WithdrawRecord[];
  totalPage: number;
  currentPage: number;
}
