"use client";
import { ClerkLoaded, ClerkLoading, SignIn, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoSignIn = async () => {
    if (!isLoaded || loadingDemo) return;

    setLoadingDemo(true);

    try {
      const signInResult = await signIn.create({
        identifier: "demo@memoorize.com",
        password: "password",
      });

      if (signInResult.status === "complete") {
        await setActive({ session: signInResult.createdSessionId });
        router.replace("/dashboard");
      } else {
        console.error("Sign-in did not complete.");
      }
    } catch (error) {
      console.error("Demo sign-in failed:", error);
      alert("Failed to sign in as demo user");
    } finally {
      setLoadingDemo(false);
    }
  };
  return (
    <div className="flex flex-col	justify-center items-center bg-gradient-to-r h-screen text-light-gray font-sans">
      <a href="/" className="hover:text-dark-gray">
        Back
      </a>
      <ClerkLoading>
        <div className="bg-light-gray shadow-md rounded-lg w-[400px] max-w-md h-[480.98px] p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 animate-skeleton-wave"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f7f7f7 25%, #f2f2f2 50%, #f7f7f7 75%)",
            }}
          ></div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn fallbackRedirectUrl="/dashboard" />
        <button
          className="mt-4 bg-secondary text-white rounded px-4 py-2 disabled:bg-gray-500"
          onClick={handleDemoSignIn}
          disabled={loadingDemo}
        >
          {loadingDemo ? "Signing in..." : "Sign in as Demo User"}
        </button>
      </ClerkLoaded>
    </div>
  );
}
