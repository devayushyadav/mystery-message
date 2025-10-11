import connectToDB from "@/lib/dbConnect";
import { sendResponse } from "@/lib/SendResponse";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/models/User";

// POST request handler for updating message acceptance status
export async function POST(request: Request) {
  try {
    await connectToDB(); // Await the database connection

    // Get session and user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return sendResponse("Not authenticated", false, 401); // If no session or user
    }

    const userID = user._id;
    const { acceptMessages } = await request.json(); // Get the acceptMessages from the request body

    if (typeof acceptMessages !== "boolean") {
      return sendResponse("Invalid value for acceptMessages", false, 400); // Check if acceptMessages is a boolean
    }

    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return sendResponse("Cannot update user", false, 400); // Use 400 if update fails
    }

    return sendResponse(
      "Message acceptance status updated successfully",
      true,
      200,
      updatedUser
    ); // Successful update response
  } catch (error) {
    console.error(error);
    return sendResponse("Something went wrong", false, 500); // Internal server error
  }
}

// GET request handler
export async function GET(request: Request) {
  try {
    await connectToDB(); // Await the database connection

    // Get session and user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return sendResponse("Not authenticated", false, 401); // If no session or user
    }

    const userID = user._id;

    const foundUser = await UserModel.findById(userID);

    if (!foundUser) {
      return sendResponse("User not found", false, 404); // User not found
    }

    // Send success response with the user's message acceptance status
    return sendResponse("User found", true, 200, {
      isAcceptingMessage: foundUser.isAcceptingMessage,
    });
  } catch (error) {
    console.error(error);
    return sendResponse("Something went wrong", false, 500); // Internal server error
  }
}
