import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { NextResponse } from "next/server";
import { connectDb } from "@/db/db";
import { Progess } from "@/models/progress";
import { serialize } from "cookie";
import { Users } from "@/models/user";
import { checkValidation } from "@/utils/token";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));

    const serialized = serialize("usertoken", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      expires: new Date(0),
      maxAge: 0,
    });

    if (!isvalid) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 400,
        headers: {
          "Set-Cookie": serialized,
        },
      });
    }

    const { id } = JSON.parse(JSON.stringify(isvalid));

    await connectDb();
    const user = await Users.findById(id);

    if (!user) {
      const response = new ApiResponse(200, "User not found", {}, true);
      return NextResponse.json(response, {
        status: 200,
        headers: {
          "Set-Cookie": serialized,
        },
      });
    }

    const isExsited = await Progess.findOne(user._id);
    if (!isExsited) {
      const response = new ApiResponse(400, "progess don't existed", {}, true);
      return NextResponse.json(response, {
        status: 400,
      });
    }

    const response = new ApiResponse(
      200,
      "progess fetched",
      { ...isExsited },
      true
    );

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error: any) {
    const response = new ApiResponse(
      error.statusCode || 500,
      error.message || "Server Error",
      ENVIROMENT === "dev" ? error.stack || {} : {},
      false
    );
    return NextResponse.json(response, {
      status: error.statusCode || 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));

    const serialized = serialize("usertoken", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      expires: new Date(0),
      maxAge: 0,
    });

    if (!isvalid) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 400,
        headers: {
          "Set-Cookie": serialized,
        },
      });
    }

    const { id } = JSON.parse(JSON.stringify(isvalid));

    await connectDb();
    const user = await Users.findById(id);

    if (!user) {
      const response = new ApiResponse(400, "User not found", {}, true);
      return NextResponse.json(response, {
        status: 400,
        headers: {
          "Set-Cookie": serialized,
        },
      });
    }

    const isExsited = await Progess.findOne(user._id);
    if (isExsited) {
      const response = new ApiResponse(
        400,
        "progess already existed",
        {},
        true
      );
      return NextResponse.json(response, {
        status: 400,
      });
    }

    const newProgress = await Progess.create({ userId: user._id });

    const response = new ApiResponse(
      201,
      "progress created",
      { ...newProgress },
      true
    );
    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: any) {
    const response = new ApiResponse(
      error.statusCode || 500,
      error.message || "Server Error",
      ENVIROMENT === "dev" ? error.stack || {} : {},
      false
    );
    return NextResponse.json(response, {
      status: error.statusCode || 500,
    });
  }
}
