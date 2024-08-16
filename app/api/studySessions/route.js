import { db } from "@/firebase";
import { collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET active study session
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const setId = searchParams.get('setId');

  try {
    const studySessionCollection = collection(db, 'StudySessions');
    const sessionQuery = query(
      studySessionCollection,
      where('userId', '==', userId),
      where('setId', '==', setId),
      where('status', '==', 'active')
    );

    const querySnapshot = await getDocs(sessionQuery);
    const activeSession = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (activeSession.length > 0) {
      return NextResponse.json(activeSession[0], { status: 200 });
    } else {
      console.log('No active study session found');
      return NextResponse.json({ message: 'No active study session found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching active study session:', error);
    return NextResponse.json({ error: 'Failed to fetch active study session' }, { status: 500 });
  }
}

// POST create study session
export async function POST(request) {
    const { userId, courseId, setId } = await request.json();
    try {
        const studySession = {
            userId,
            courseId,
            setId,
            sessionStart: Timestamp.now(),
            sessionEnded: null,
            flashcardsStudied: [],
            status: 'active',
        }
        const studySessionsCollection = collection(db, 'StudySessions');
        const studySessionRef = await addDoc(studySessionsCollection, studySession);
        const studySessionId = studySessionRef.id;

        return NextResponse.json({ id: studySessionId, ...studySession }, { status: 200 });
    } catch (error) {
        console.error('Error creating study session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
