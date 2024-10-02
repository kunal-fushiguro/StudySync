import { connectDb } from "@/db/db";
import { Users } from "@/models/user";
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
    const user = await Users.findById(id).populate("studyPlans");

    if (!user) {
      const response = new ApiResponse(200, "User not found", {}, true);
      return NextResponse.json(response, {
        status: 200,
        headers: {
          "Set-Cookie": serialized,
        },
      });
    }

    delete user._doc.password;

    const response = new ApiResponse(
      200,
      "studyplan fetched  successfully.",
      { ...user?._doc },
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
    return NextResponse.json(response, { status: error.statusCode || 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));
    const body = await request.json();
    const { title, description, duration, createdDate, endDate } = body;

    if (!title || !description || !duration || !createdDate || !endDate) {
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

    const newStudyplan = await StudyPlan.create({
      userId: user._id,
      title,
      description,
      duration,
      createdDate,
      endDate,
    });

    await Users.findByIdAndUpdate(user._id, {
      $push: {
        studyPlans: newStudyplan._id,
      },
    });

    const response = new ApiResponse(
      201,
      "Studyplan created.",
      { ...newStudyplan._doc },
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
    return NextResponse.json(response, { status: error.statusCode || 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));
    const body = await request.json();
    const { studyId, title, description, duration, createdDate, endDate } =
      body;

    if (
      !studyId ||
      !title ||
      !description ||
      !duration ||
      !createdDate ||
      !endDate
    ) {
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

    const studyPlan = await StudyPlan.findById(studyId);
    if (studyPlan.userId != id) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 401,
      });
    }

    const updatedStudyplan = await StudyPlan.findByIdAndUpdate(studyId, {
      title,
      description,
      duration,
      createdDate,
      endDate,
    });

    const response = new ApiResponse(
      201,
      "Studyplan updated.",
      { ...updatedStudyplan._doc },
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

export async function DELETE(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));
    const body = await request.json();
    const { studyId } = body;

    if (!studyId) {
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

    const studyPlan = await StudyPlan.findById(studyId);
    if (studyPlan.userId != id) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 401,
      });
    }

    await StudyPlan.findByIdAndDelete(studyId);
    await Users.findByIdAndUpdate(id, {
      $pull: {
        studyPlans: studyPlan._id,
      },
    });

    const response = new ApiResponse(201, "Studyplan deleted.", {}, true);
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
