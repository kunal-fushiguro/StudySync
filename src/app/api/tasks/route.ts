import { connectDb } from "@/db/db";
import { StudyPlan } from "@/models/studyplan";
import { Tasks } from "@/models/tasks";
import { Users } from "@/models/user";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { checkValidation } from "@/utils/token";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));
    const body = await request.json();
    const { studyPlanId, title, description, priority, dueDate } = body;

    if (!studyPlanId || !title || !description || !priority || !dueDate) {
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

    const studyplan = await StudyPlan.findById(studyPlanId);

    if (studyplan.userId != id) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 401,
      });
    }

    const task = await Tasks.create({
      studyPlanId,
      title,
      description,
      priority,
      dueDate,
    });

    const newStudyTasks = await StudyPlan.findByIdAndUpdate(
      studyplan._id,
      {
        $push: {
          tasks: task,
        },
      },
      { new: true }
    ).populate("tasks");

    const response = new ApiResponse(
      201,
      "new task created",
      { ...newStudyTasks },
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
    const { taskId, studyPlanId, title, description, priority, dueDate } = body;

    if (
      !taskId ||
      !studyPlanId ||
      !title ||
      !description ||
      !priority ||
      !dueDate
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

    const studyplan = await StudyPlan.findById(studyPlanId);

    if (studyplan.userId != id) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 401,
      });
    }

    const task = await Tasks.findByIdAndUpdate(taskId, {
      title,
      description,
      priority,
      dueDate,
    });

    const newStudyTasks = await StudyPlan.findById(studyplan._id).populate(
      "tasks"
    );

    const response = new ApiResponse(
      200,
      "Task updated",
      { ...newStudyTasks },
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

export async function PATCH(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();
    const isvalid = await checkValidation(String(token));
    const body = await request.json();
    const { taskId, studyPlanId, minutes } = body;

    if (!studyPlanId || !taskId || !minutes) {
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

    const studyplan = await StudyPlan.findById(studyPlanId);

    if (studyplan.userId != id) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 401,
      });
    }

    const task = await Tasks.findByIdAndUpdate(taskId, {
      minutes: minutes,
    });

    const newStudyTasks = await StudyPlan.findById(studyplan._id).populate(
      "tasks"
    );

    const response = new ApiResponse(
      200,
      "Task minutes updated",
      { ...newStudyTasks },
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
    const { taskId, studyPlanId } = body;

    if (!studyPlanId || !taskId) {
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

    const studyplan = await StudyPlan.findById(studyPlanId);

    if (studyplan.userId != id) {
      const response = new ApiResponse(401, "Unauthraized", {}, true);
      return NextResponse.json(response, {
        status: 401,
      });
    }

    await Tasks.findByIdAndDelete(taskId);

    const newStudyTasks = await StudyPlan.findByIdAndUpdate(
      studyplan._id,
      {
        $pull: { tasks: taskId },
      },
      { new: true }
    ).populate("tasks");

    const response = new ApiResponse(
      200,
      "Task deleted",
      { ...newStudyTasks },
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
