import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json({
      message: "Không nhận được refresh token",
      status: 401,    
    });
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken });
    console.log('payload', payload);
    const decodeAccessToken = jwt.decode(payload.data.accessToken) as { exp: number };
    const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number };
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json({
        message: error.message ?? 'Có lỗi xảy ra',
        status: 401,
        });
    }
}
