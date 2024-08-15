import { db } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET all flashcards in a set
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const setId = searchParams.get('setId');
    const userId = searchParams.get('userId');

    if (!setId || !userId) {
        return NextResponse.json({ error: 'Set ID and User ID are required' }, { status: 400 });
    }

    try {
        const flashcardSetRef = doc(db, 'FlashcardSets', setId);
        const flashcardSetDoc = await getDoc(flashcardSetRef);
        const flashcardSetData = flashcardSetDoc.data();

        const flashcardsCollection = collection(db, 'Flashcards');
        const flashcardsQuery = query(
            flashcardsCollection,
            where('setId', '==', setId),
            where('userId', '==', userId)
        );
        const flashcardsSnapshot = await getDocs(flashcardsQuery);

        const flashcards = flashcardsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        const data = {
            flashcards,
            setTitle: flashcardSetData.title,
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching flashcards:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST (add) a flashcard
export async function POST(request) {
    try {
        const { question, answer, setId, userId, isAIGenerated, richMedia } = await request.json();

        if (!question || !answer || !setId || !userId) {
            return NextResponse.json({ error: 'Question, Answer, Set ID, and User ID are required' }, { status: 400 });
        }

        // check user subscription plan & ai flashcard limit
        const userDocRef = doc(db, 'Users', userId);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userSnapshot.data();
		const subscriptionPlanId = userData.subscriptionPlan;

        // get subscription plan data
        const subscriptionPlanRef = doc(db, 'SubscriptionPlans', subscriptionPlanId);
        const subscriptionPlanSnapshot = await getDoc(subscriptionPlanRef);

        if (!subscriptionPlanSnapshot.exists()) {
            return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
        }

        const subscriptionPlanData = subscriptionPlanSnapshot.data();

        if (isAIGenerated && userData.aiFlashcardsUsedThisMonth >= subscriptionPlanData.aiFlashcardLimit) {
            return NextResponse.json({ error: 'AI-generated flashcard limit reached' }, { status: 403 });
        }

        // get user's current flashcard count
        const flashcardsCollection = collection(db, 'Flashcards');
        const flashcardsQuery = query(
            flashcardsCollection,
            where('userId', '==', userId)
        );
        const flashcardsSnapshot = await getDocs(flashcardsQuery);
        const currentFlashcardCount = flashcardsSnapshot.size;

        if (currentFlashcardCount >= subscriptionPlanData.flashcardLimit) {
            return NextResponse.json({ error: 'Flashcard limit reached' }, { status: 403 });
        }

        const newFlashcardRef = await addDoc(flashcardsCollection, {
            question,
            answer,
            richMedia,
            setId,
            userId,
            isAIGenerated,
            reviewCount: 0,
            difficulty: null,
            lastReviewedAt: null,
            nextReviewDate: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await updateDoc(newFlashcardRef, { id: newFlashcardRef.id });

        if (isAIGenerated) {
            await updateDoc(userDocRef, {
                aiFlashcardsUsedThisMonth: userData.aiFlashcardsUsedThisMonth + 1,
            });
        }

        const newFlashcardSnapshot = await getDoc(newFlashcardRef);
        return NextResponse.json(newFlashcardSnapshot.data(), { status: 200 });
    } catch (error) {
        console.error('Error adding flashcard:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE flashcard
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const flashcardId = searchParams.get('id');
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
            return NextResponse.json({ error: 'You cannot delete a flashcard that is not yours' }, { status: 403 });
        }

        await deleteDoc(flashcardDocRef);

        return NextResponse.json({ message: "Flashcard set deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting flashcard:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT (edit) a flashcard
export async function PUT(request) {
    const { id, question, answer, difficulty, lastReviewedAt, nextReviewDate, userId } = await request.json();

    if (!id || !userId) {
        return NextResponse.json({ error: 'Flashcard ID and User ID are required' }, { status: 400 });
    }

    try {
        const flashcardRef = doc(db, 'Flashcards', id);
        const flashcardSnapshot = await getDoc(flashcardRef);

        if (!flashcardSnapshot.exists()) {
            return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
        }

        const flashcardData = flashcardSnapshot.data();

        if (flashcardData.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await updateDoc(flashcardRef, {
            question: question ?? flashcardData.question,
            answer: answer ?? flashcardData.answer,
            difficulty: difficulty ?? flashcardData.difficulty,
            lastReviewedAt: lastReviewedAt ?? flashcardData.lastReviewedAt,
            nextReviewDate: nextReviewDate ?? flashcardData.nextReviewDate,
            updatedAt: serverTimestamp(),
        });

        const updatedFlashcardSnapshot = await getDoc(flashcardRef);
        const updatedFlashcardData = updatedFlashcardSnapshot.data();

        return NextResponse.json(updatedFlashcardData, { status: 200 });
    } catch (error) {
        console.error('Error updating flashcard:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
