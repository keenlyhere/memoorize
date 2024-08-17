import { db } from "@/firebase";
import { collection,  getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET all study sessions for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const studySessionCollection = collection(db, 'StudySessions');
    const sessionsQuery = query(
      studySessionCollection,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(sessionsQuery);
    const sessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch study sessions' }, { status: 500 });
  }
}
