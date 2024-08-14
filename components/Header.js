'use client'
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
    const { isLoaded, isSignedIn, user } = useUser();
  return (
    <header className="bg-primary-purple text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-2xl font-bold">memoorize</div>
        <div className="relative">
            <button className="focus:outline-none">
              <Image src={user?.imageUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-dark-gray rounded-lg shadow-lg hidden">
            <a href="#" className="block px-4 py-2 hover:bg-light-gray">Profile</a>
            <a href="#" className="block px-4 py-2 hover:bg-light-gray">Settings</a>
            <a href="#" className="block px-4 py-2 hover:bg-light-gray">Logout</a>
            </div>
        </div>
    </header>

  )
}
