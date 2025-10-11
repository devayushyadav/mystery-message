import connectToDB from "@/lib/dbConnect";
import { sendResponse } from "@/lib/SendResponse";
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

    if (!result.success) {
      const errors = result.error.format().username?._errors || [];
      return sendResponse(
        errors.length > 0 ? errors.join(",") : "Something went wrong",
        false,
        400
      );
    }

    const { username } = result.data;

    const doUserAlreadyExists = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (doUserAlreadyExists) {
      return sendResponse("Username is already taken, try another", false, 400);
    }
    return sendResponse("Username is available", true, 200);
  } catch (error) {
    console.log(error);
    return sendResponse("Something went wrong", false, 500);
  }
}
