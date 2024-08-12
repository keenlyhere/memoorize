'use client'
import { useUser } from "@clerk/nextjs";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
    return null;
  }

    console.log('user:', user)

    return (
        <div>Flashcard</div>
    )
}
