import connectToDB from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendResponse } from "@/lib/SendResponse";
import mongoose from "mongoose";
import { UserModel } from "@/models/User";

// GET request handler
export async function GET(request: Request) {
  try {
    await connectToDB(); // Await the database connection

    // Get session and user
    const session = await getServerSession(authOptions);
    const loggedInuser: User = session?.user as User;

    if (!session || !loggedInuser) {
      return sendResponse("Not authenticated", false, 401); // If no session or user
    }

    const userID = new mongoose.Types.ObjectId(loggedInuser._id);

    const user = await UserModel.aggregate([
      { $match: { $id: userID } },
      { $unwind: "$messages" },
      { $sort: { "$messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return sendResponse("User not found", false, 401);
    }
    return sendResponse("Ok", true, 200, user);
  } catch (error) {
    console.error(error);
    return sendResponse("Something went wrong", false, 500); // Internal server error
  }
}
