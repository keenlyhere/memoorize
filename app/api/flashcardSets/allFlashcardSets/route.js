import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET all flashcard sets for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    const flashcardSetsCollection = collection(db, 'FlashcardSets');
    const setsQuery = query(
      flashcardSetsCollection,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(setsQuery);
    const sets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(sets, { status: 200 });
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return NextResponse.json({ error: 'Failed to fetch flashcard sets' }, { status: 500 });
  }
}
