import { Users } from "@/models/user";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { compareThePassword } from "@/utils/password";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { generateToken } from "@/utils/token";
import { connectDb } from "@/db/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      const response = new ApiResponse(
        400,
        "All fields are required.",
        {},
        false
      );
      return NextResponse.json(response, { status: 400 });
    }

    await connectDb();

    // check user exist or not
    const user = await Users.findOne({ email: email });
    if (!user) {
      const response = new ApiResponse(400, "User not found.", {}, false);
      return NextResponse.json(response, { status: 400 });
    }

    const isCorrect = await compareThePassword(password, user.password);

    if (!isCorrect) {
      const response = new ApiResponse(401, "Unauthorized access.", {}, false);
      return NextResponse.json(response, { status: 401 });
    }

    // generate token
    const token = await generateToken(user._id);
    const serialized = serialize("userToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    delete user._doc.password;

    const response = new ApiResponse(
      200,
      "User login successfully.",
      { ...user?._doc },
      true
    );
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
