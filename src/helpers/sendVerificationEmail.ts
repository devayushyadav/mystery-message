import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import OtpEmail from "../../emails/VerificationEmailTemplate";

export const sendVerificationEmail = async (
  email: string,
  otp: string,
  username: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Mystery Message Account",
      react: await OtpEmail({ otp, username }),
    });

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
};
