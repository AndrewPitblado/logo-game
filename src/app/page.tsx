import { SignedOut, SignedIn } from "@clerk/nextjs";

import LogoQuiz from "~/app/_components/LogoQuiz";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in to play the Logo Game.
          <br />
          <br />
          <a href="https://logo.dev">Logos provided by Logo.dev</a>
        </div>
      </SignedOut>
      <SignedIn>
        <LogoQuiz />
      </SignedIn>
    </main>
  );
}
