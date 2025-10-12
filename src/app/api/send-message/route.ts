import connectToDB from "@/lib/dbConnect";
import { sendResponse } from "@/lib/SendResponse";
import { Message, UserModel } from "@/models/User";

export async function POST(request: Request) {
  await connectToDB();
  try {
    // Parse request body
    const { username, message } = await request.json();

    // Find user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return sendResponse("User not found", false, 404);
    }

    if (!user.isAcceptingMessage) {
      return sendResponse("User is not acceptinng message ", false, 403);
    }

    const newMessage = {
      content: message,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);

    await user.save();

    return sendResponse("Message sent successfully", true, 200);
  } catch (error) {
    console.error(error);
    return sendResponse("Something went wrong", false, 500);
  }
}
