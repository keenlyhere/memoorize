'use client'
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, collection, getDocs, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { flashcards, setFlashcards } = useState([]);

    useEffect(() => {
        const getFlashcards = async () => {
            if (user) {
                // check if doc exists
                const docRef = doc(collection(db, 'Users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // get all flashcard collection names
                    const collections = docSnap.data().flashcards;
                    console.log('collections:', collections);
                    setFlashcards(collections);
                } else {
                    // create flashcard
                    await setDoc(docRef,{ flashcards: [] })
                }
            }
        }

        getFlashcards();
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <div>Flashcard</div>
    )
}
