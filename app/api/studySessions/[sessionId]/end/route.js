import { db } from "@/firebase";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// PUT end study session
export async function PUT(request, { params }) {
	const { sessionId } = params;

	try {
		const sessionRef = doc(db, "StudySessions", sessionId);
		await updateDoc(sessionRef, {
            sessionEnded: Timestamp.now(),
            status: "ended",
        });

		return NextResponse.json({ sessionData: null}, { status: 200 });
	} catch (error) {
        console.error('Error ending study session:', error.message);
		return NextResponse.json({ error: "Failed to resume study session" }, { status: 500 });
	}
}
