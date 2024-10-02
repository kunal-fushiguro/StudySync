import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const newToken = "";

    const serialized = serialize("usertoken", newToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      expires: new Date(0),
      maxAge: 0,
    });

    const response = new ApiResponse(200, "User logout", {}, true);
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Set-Cookie": serialized,
      },
    });
  } catch (error: any) {
    const response = new ApiResponse(
      error.statusCode || 500,
      error.message || "Server Error",
      ENVIROMENT === "dev" ? error.stack || {} : {},
      false
    );
    return NextResponse.json(response, { status: error.statusCode || 500 });
  }
}
