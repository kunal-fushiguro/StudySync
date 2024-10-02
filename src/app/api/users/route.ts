import { connectDb } from "@/db/db";
import { Users } from "@/models/user";
import { ApiResponse } from "@/utils/apiResponse";
import { ENVIROMENT } from "@/utils/env";
import { hashThePassword } from "@/utils/password";
import { checkValidation } from "@/utils/token";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

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
    delete user._doc.password;

    const response = new ApiResponse(
      200,
      "User data feteched.",
      { ...user._doc },
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

    await Users.create({
      name: name,
      email: email,
      password: newPassword,
      profilePic: profilePic,
      themes: themes,
      banckgroundImg: banckgroundImg,
    });

    const response = new ApiResponse(
      201,
      "User created please login",
      {},
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
    const { name, profilePic, themes, banckgroundImg } = await request.json();

    await connectDb();
    const updateUser = await Users.findByIdAndUpdate(id, {
      name: name,
      profilePic: profilePic,
      themes: themes,
      banckgroundImg: banckgroundImg,
    });

    if (!updateUser) {
      const response = new ApiResponse(400, "User not found", {}, true);
      return NextResponse.json(response, {
        status: 400,
        headers: {
          "Set-Cookie": serialized,
        },
      });
    }

    delete updateUser._doc.password;

    const response = new ApiResponse(
      200,
      "User updated",
      { ...updateUser._doc },
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
    await Users.findByIdAndDelete(id);

    const response = new ApiResponse(200, "User deleted", {}, true);
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
