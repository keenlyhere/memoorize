import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET a single flashcard by its ID
export async function GET(request, { params }) {
    const { flashcardId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!flashcardId || !userId) {
        return NextResponse.json({ error: 'Flashcard ID and User ID are required' }, { status: 400 });
    }

    try {
        const flashcardDocRef = doc(db, 'Flashcards', flashcardId);
        const flashcardDoc = await getDoc(flashcardDocRef);

        if (!flashcardDoc.exists()) {
            return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
        }

        const flashcardData = flashcardDoc.data();

        if (flashcardData.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized access to this flashcard' }, { status: 403 });
        }

        return NextResponse.json(flashcardData, { status: 200 });
    } catch (error) {
        console.error('Error fetching flashcard:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


    // cardid:4kCgskZQshf65xo2Rh8x
