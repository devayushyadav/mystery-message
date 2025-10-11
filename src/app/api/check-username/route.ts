import connectToDB from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { userNameValdiation } from "@/schemas/signUpSchema";
import z from "zod";

const userNameQuery = z.object({
  username: userNameValdiation,
});

export async function GET(request: Request) {
  await connectToDB();
  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = userNameQuery.safeParse(queryParam);

    console.log(result);

    if (!result.success) {
      const errors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            errors.length > 0 ? errors.join(",") : "Something went wrong",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const doUserAlreadyExists = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (doUserAlreadyExists) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken, try another",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
