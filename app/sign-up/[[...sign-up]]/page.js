import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col	justify-center items-center bg-gradient-to-r h-screen text-light-gray font-sans">
      <a href="/" className="hover:text-dark-gray">Back</a>
      <ClerkLoading>
         <div className="bg-light-gray shadow-md rounded-lg w-[400px] max-w-md h-[560.98px] p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 animate-skeleton-wave"
            style={{
              backgroundImage: 'linear-gradient(90deg, #f7f7f7 25%, #f2f2f2 50%, #f7f7f7 75%)',
            }}
          ></div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignUp fallbackRedirectUrl="/dashboard" />
      </ClerkLoaded>
    </div>
  );
}
