import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col	justify-center items-center bg-gradient-to-r h-screen text-light-gray font-sans">
      <a href="/" className="hover:text-dark-gray">Back</a>
      <SignIn />
    </div>
    );
}
