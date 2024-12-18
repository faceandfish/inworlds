import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { i18n, getLocaleFromHeader } from "@/app/i18n-config";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查路径是否已经包含有效的语言代码
  const pathnameHasValidLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 只在路径不包含有效语言代码时添加语言代码
  if (!pathnameHasValidLocale) {
    const acceptLanguage = request.headers.get("accept-language");
    const locale = getLocaleFromHeader(acceptLanguage);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // 认证检查
  try {
    await auth();
    // 如果 auth() 成功完成，用户已认证
    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // 排除不需要重定向的路径
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};
