import { connectDb } from "@/db/db";
import { Progess } from "@/models/progress";
import { Tracker } from "@/models/tracker";
import { Users } from "@/models/user";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { checkValidation } from "@/utils/token";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));

    const body = await request.json();
    const { skip, limit } = body;

    if (!skip || !limit) {
      const response = new ApiResponse(
        400,
        "All fields are required.",
        {},
        false
      );
      return NextResponse.json(response, { status: 400 });
    }

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

    const isExsited = await Progess.findOne(user._id).populate({
      path: "progressDays",
      options: { skip: skip, limit: limit },
    });
    if (!isExsited) {
      const response = new ApiResponse(400, "progess don't existed", {}, true);
      return NextResponse.json(response, {
        status: 400,
      });
    }

    const response = new ApiResponse(
      201,
      "progress feteched",
      { ...isExsited },
      true
    );
    return NextResponse.json(response, { status: 201 });
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

    const body = await request.json();
    const { minutes, date } = body;

    if (!minutes || !date) {
      const response = new ApiResponse(
        400,
        "All fields are required.",
        {},
        false
      );
      return NextResponse.json(response, { status: 400 });
    }

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

    const newTracker = await Tracker.create({ minutes, date });
    const newTotal = minutes + isExsited.total;
    const pushTracker = await Progess.findByIdAndUpdate(
      isExsited._id,
      {
        $push: { progressDays: { $each: [newTracker._id], $position: 0 } },
        total: newTotal,
      },
      { new: true }
    );

    const response = new ApiResponse(
      201,
      "tracker created",
      { ...pushTracker },
      true
    );
    return NextResponse.json(response, { status: 201 });
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
