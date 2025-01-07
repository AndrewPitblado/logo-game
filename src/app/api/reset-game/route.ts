import { auth } from "@clerk/nextjs/server";
import { resetGameProgress } from "~/server/queries";

export async function POST(request: Request) {
  try {
    const user = await auth();
    if (!user.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await resetGameProgress();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error resetting game:", error);
    return new Response(JSON.stringify({ error: "Failed to reset game" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
