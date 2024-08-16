import { db } from "@/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// PUT update study session
export async function PUT(request, { params }) {
	const { sessionId } = params;
    const { flashcardId, difficulty, reviewTime, currentFlashcardIndex } = await request.json();

	try {
		const sessionRef = doc(db, "StudySessions", sessionId);
		await updateDoc(sessionRef, {
            flashcardsStudied: arrayUnion({ flashcardId, difficulty, reviewTime }),
            currentFlashcardIndex,
        });
        const sessionDoc = await getDoc(sessionRef);

        if (!sessionDoc.exists()) {
            console.error('Session not found');
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const sessionData = { id: sessionDoc.id, ...sessionDoc.data() };

		return NextResponse.json(sessionData, { status: 200 });
	} catch (error) {
        console.error('Error ending study session:', error.message);
		return NextResponse.json({ error: "Failed to resume study session" }, { status: 500 });
	}
}
