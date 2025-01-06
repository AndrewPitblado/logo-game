import { auth } from "@clerk/nextjs/server";
import { markLogoAsGuessed } from "~/server/queries";

export async function POST(request: Request) {
  try {
    const user = await auth();
    if (!user.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    console.log("Marking logo as guessed:", body);
    const imageId = parseInt(body.imageId);

    if (!imageId || isNaN(imageId)) {
      return new Response("Invalid image ID", { status: 400 });
    }

    await markLogoAsGuessed(imageId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error marking logo as guessed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to mark logo as guessed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
