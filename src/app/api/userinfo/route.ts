// app/api/userinfo/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { User, UserResponse, ApiResponse } from "@/app/lib/definitions"; // 请确保路径正确

// 定义缓存项的接口
interface CacheItem {
  data: UserResponse;
  timestamp: number;
}

// 使用 Node.js 的 global 对象来存储缓存，这样在热重载时缓存不会丢失
declare global {
  var cache: Map<string, CacheItem>;
}

if (!global.cache) {
  global.cache = new Map<string, CacheItem>();
}

const CACHE_TTL = 60 * 1000; // 1 分钟缓存

export async function GET(
  request: NextRequest
): Promise<NextResponse<UserResponse>> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { code: 401, msg: "Not authenticated", data: null },
      { status: 401 }
    );
  }

  // 检查缓存
  const cachedData = global.cache.get(token);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedData.data);
  }

  try {
    const response = await fetch(
      "http://8.142.44.107:8088/inworlds/api/user/principal",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();

    const apiResponse: UserResponse = { code: 200, msg: "Success", data };

    // 更新缓存
    global.cache.set(token, { data: apiResponse, timestamp: Date.now() });

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { code: 500, msg: "Error fetching user info", data: null },
      { status: 500 }
    );
  }
}

// 可选：添加其他 HTTP 方法的处理
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
