import { db } from "~/server/db";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { getMyLogos } from "~/server/queries";
export const dynamic = "force-dynamic";

async function logos() {
  const images = await getMyLogos();
  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={image.id} className="m-4">
          <img src={image.url} alt={`Logo ${image.id}`} />
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in to play the Logo Game.
        </div>
      </SignedOut>
      <SignedIn>{logos()}</SignedIn>
    </main>
  );
}
