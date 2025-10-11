import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectToDB from "@/lib/dbConnect";
import { sendResponse } from "@/lib/SendResponse";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectToDB();

  try {
    const { username, email, password } = await request.json();
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return sendResponse("Username already taken", false, 400);
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return sendResponse(
          "Email already registered and verified.",
          false,
          400
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      verifyCode,
      username
    );

    if (!emailResponse.success) {
      return sendResponse(emailResponse.message, false, 500);
    }

    return sendResponse(
      "User registered successfully. Verification email sent.",
      true,
      201
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return sendResponse("Something went wrong", false, 500);
  }
}
