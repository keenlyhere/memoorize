import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// PUT resume study session
export async function PUT(request, { params }) {
	const { sessionId } = params;

	try {
		const sessionRef = doc(db, "StudySessions", sessionId);
		await updateDoc(sessionRef, { status: "active" });
        const sessionDoc = await getDoc(sessionRef);

        if (!sessionDoc.exists()) {
            console.error('Session not found');
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const sessionData = { id: sessionDoc.id, ...sessionDoc.data() };
		return NextResponse.json(sessionData, { status: 200 });
	} catch (error) {
        console.error('Error resuming study session:', error.message);
		return NextResponse.json({ error: "Failed to resume study session" }, { status: 500 });
	}
}
