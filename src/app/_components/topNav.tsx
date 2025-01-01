"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UploadButton } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";
export function TopNav() {
  const router = useRouter();
  return (
    <nav className="flex w-full items-center justify-between border-b bg-gray-800 p-4 font-semibold text-white">
      <div className="text-2xl">Logo Game</div>
      <div className="text-2xl">Score: 0</div>
      <div className="flex flex-row">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={() => {
              router.refresh();
            }}
          />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
