// Helper function to send a JSON response with the desired status code
export const sendResponse = (
  message: string,
  success: boolean,
  status: number
) => {
  return Response.json({ success, message }, { status });
};
