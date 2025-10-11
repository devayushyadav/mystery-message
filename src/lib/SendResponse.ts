// Helper function to send a JSON response with the desired status code
export const sendResponse = (
  message: string,
  success: boolean,
  status: number,
  data?: object
) => {
  return new Response(JSON.stringify({ success, data, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};
