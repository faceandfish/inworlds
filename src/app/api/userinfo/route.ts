// app/api/userinfo/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { User, UserResponse, ApiResponse } from "@/app/lib/definitions"; // 请确保路径正确
import { getUserInfo } from "@/app/lib/action";

export async function GET(
  request: NextRequest
): Promise<NextResponse<UserResponse>> {
  const { data } = await getUserInfo();

  if (!data) {
    return NextResponse.json(
      { code: 401, msg: "Not authenticated", data: null },
      { status: 401 }
    );
  }

  try {
    const apiResponse: UserResponse = { code: 200, msg: "Success", data };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { code: 500, msg: "Error fetching user info", data: null },
      { status: 500 }
    );
  }
}
