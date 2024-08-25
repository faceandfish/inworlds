// utils/imageUrl.ts

const IMAGE_BASE_URL = "http://8.142.44.107:9000/book-bucket/";
const AVATAR_BASE_URL = "http://8.142.44.107:9000/avatar-bucket/";

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return getFallbackImageUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${IMAGE_BASE_URL}${path}`;
}

export function getAvatarUrl(path: string | null | undefined): string {
  if (!path) return getFallbackImageUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${AVATAR_BASE_URL}${path}`;
}

export function getFallbackImageUrl(): string {
  return "/avatar.png"; // 替换为您的默认图片路径
}
