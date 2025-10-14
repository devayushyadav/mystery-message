import connectToDB from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { sendResponse } from "@/lib/SendResponse";
import mongoose from "mongoose";
import { UserModel } from "@/models/User";

// GET request handler
export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  try {
    const messageid = params.messageid;

    if (!messageid) {
      return sendResponse("Message ID is required", false, 400); // Bad request if no message ID
    }

    await connectToDB(); // Await the database connection

    // Get session and user
    const session = await getServerSession(authOptions);
    const loggedInuser: User = session?.user as User;

    if (!session || !loggedInuser) {
      return sendResponse("Not authenticated", false, 401); // If no session or user
    }
    const updatedResult = await UserModel.updateOne(
      { _id: new mongoose.Types.ObjectId(loggedInuser.id) },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return sendResponse("Message not found or already deleted", false, 404); // Not found if no message was deleted
    }

    return sendResponse("Message deleted successfully", true, 200); // Success response
  } catch (error) {
    console.error(error);
    return sendResponse("Something went wrong", false, 500); // Internal server error
  }
}
