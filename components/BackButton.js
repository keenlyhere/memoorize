'use client'
import { useRouter } from "next/navigation"

export default function BackButton({ children }) {
    const router = useRouter();

  return (
    <button
        type="button"
        className="dark:text-primary-purple flex justify-center content-center gap-1"
        onClick={() => router.back()}
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 self-center">
            <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        { children }
    </button>
  )
}
