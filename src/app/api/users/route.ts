import { connectDb } from "@/db/db";
import { Users } from "@/models/user";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { hashThePassword } from "@/utils/password";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = new ApiResponse(200, "Server is running", {}, true);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const response = new ApiResponse(
      error.statusCode || 500,
      error.message || "Server Error",
      ENVIROMENT === "dev" ? error.stack || {} : {},
      false
    );
    return NextResponse.json(response, { status: error.statusCode || 200 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, profilePic, themes, banckgroundImg } = body;
  if (
    !email ||
    !password ||
    !name ||
    !profilePic ||
    !themes ||
    !banckgroundImg
  ) {
    const response = new ApiResponse(
      400,
      "All fields are required.",
      {},
      false
    );
    return NextResponse.json(response, { status: 400 });
  }
  try {
    await connectDb();

    // find if user exist
    const userExist = await Users.findOne({ email: email });
    if (userExist) {
      const response = new ApiResponse(
        403,
        "Email already existed.",
        {},
        false
      );
      return NextResponse.json(response, { status: 403 });
    }

    const newPassword = await hashThePassword(password);

    const newUser = await Users.create({
      name: name,
      email: email,
      password: newPassword,
      profilePic: profilePic,
      themes: themes,
      banckgroundImg: banckgroundImg,
    });
    const response = new ApiResponse(200, "Server is running", {}, true);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const response = new ApiResponse(
      error.statusCode || 500,
      error.message || "Server Error",
      ENVIROMENT === "dev" ? error.stack || {} : {},
      false
    );
    return NextResponse.json(response, { status: error.statusCode || 200 });
  }
}
