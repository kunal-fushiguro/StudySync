import { connectDb } from "@/db/db";
import { StudyPlan } from "@/models/studyplan";
import { NextResponse } from "next/server";
import { checkValidation } from "@/utils/token";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { serialize } from "cookie";

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
    const allStudyPlans = await StudyPlan.find({ userId: id }).populate(
      "tasks"
    );

    const response = new ApiResponse(
      200,
      "Data Feteched",
      { ...allStudyPlans },
      true
    );
    return NextResponse.json(response, { status: 200 });
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
