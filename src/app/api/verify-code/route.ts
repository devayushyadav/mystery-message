import connectToDB from "@/lib/dbConnect";
import { sendResponse } from "@/lib/SendResponse";
import { User, UserModel } from "@/models/User";

// Helper function to validate the verification code
const isCodeValidAndNotExpired = (user: User, code: string) => {
  const isCodeValid = user.verifyCode === code;
  const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
  return { isCodeValid, isCodeNotExpired };
};

export async function POST(request: Request) {
  await connectToDB();
  try {
    // Parse request body
    const { username, code } = await request.json();

    console.log(username, code);

    // Find user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return sendResponse("User not found", false, 404);
    }

    if (user.isVerified) {
      return sendResponse("User is already verified", false, 400);
    }

    // Validate the verification code and expiry
    const { isCodeValid, isCodeNotExpired } = isCodeValidAndNotExpired(
      user,
      code
    );

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return sendResponse("User verified successfully", true, 200);
    }

    if (!isCodeNotExpired) {
      return sendResponse(
        "Verification code has expired, please signup again",
        false,
        400
      );
    }

    return sendResponse("Incorrect verification code", false, 400);
  } catch (error) {
    console.error(error);
    return sendResponse("Something went wrong", false, 500);
  }
}
