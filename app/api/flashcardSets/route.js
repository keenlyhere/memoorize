import { db } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET all flashcard sets for a course
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const courseId = searchParams.get("courseId");
	const userId = searchParams.get("userId");

	if (!courseId || !userId) {
		return NextResponse.json({ error: "Course ID and User ID are required" }, { status: 400 });
	}

	try {
		const setsCollection = collection(db, "FlashcardSets");
		const setsQuery = query(
			setsCollection,
			where("courseId", "==", courseId),
			where("userId", "==", userId),
			orderBy("title", "asc"),
		);
		const setsSnapshot = await getDocs(setsQuery);

		const sets = setsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return NextResponse.json(sets, { status: 200 });
	} catch (error) {
        console.error('Error fetching flashcard sets:', error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// POST (add) a flashcard set
export async function POST(request) {
	try {
		const { title, courseId, userId } = await request.json();

		if (!title || !courseId || !userId) {
			return NextResponse.json({ error: "Title, Course ID, and User ID are required" }, { status: 400 });
		}

		const userDocRef = doc(db, "Users", userId);
		const userSnapshot = await getDoc(userDocRef);

		if (!userSnapshot.exists()) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const userData = userSnapshot.data();
		const subscriptionPlanId = userData.subscriptionPlan;

		// get subscription plan data
		const subscriptionPlanRef = doc(db, "SubscriptionPlans", subscriptionPlanId);
		const subscriptionPlanSnapshot = await getDoc(subscriptionPlanRef);

		if (!subscriptionPlanSnapshot.exists()) {
			return NextResponse.json({ error: "Subscription plan not found" }, { status: 404 });
		}

		const subscriptionPlanData = subscriptionPlanSnapshot.data();
		const setLimit = subscriptionPlanData.setLimit === null ? Infinity : subscriptionPlanData.setLimit;

		// check if user exceeded set limit
		const flashcardSetsCollection = collection(db, "FlashcardSets");
		const flashcardSetsSnapshot = await getDocs(
			flashcardSetsCollection,
			where("userId", "==", userId),
			where("courseId", "==", courseId)
		);

		if (flashcardSetsSnapshot.size >= setLimit) {
			return NextResponse.json(
				{ error: "You have reached your flashcard set limit for your subscription plan." },
				{ status: 403 }
			);
		}

		const newSetDocRef = await addDoc(flashcardSetsCollection, {
			title,
			courseId,
			userId,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});

		await updateDoc(newSetDocRef, {
			id: newSetDocRef.id,
		});

		const newSetRef = await getDoc(newSetDocRef);
		const newSetData = newSetRef.data();

		return NextResponse.json(newSetData, { status: 200 });
	} catch (error) {
        console.error('Error adding flashcard set:', error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// DELETE flashcard set
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	const userId = searchParams.get("userId");

	if (!id || !userId) {
		return NextResponse.json({ error: "Set ID and User ID are required" }, { status: 400 });
	}

	try {
		const flashcardSetsDocRef = doc(db, "FlashcardSets", id);
		const flashcardSetsDoc = await getDoc(flashcardSetsDocRef);

		if (!flashcardSetsDoc.exists()) {
			return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 });
		}

		const flashcardSetsData = flashcardSetsDoc.data();

		if (flashcardSetsData.userId !== userId) {
			return NextResponse.json({ error: "You cannot delete a flashcard set that is not yours" }, { status: 403 });
		}

		await deleteDoc(flashcardSetsDocRef);

		return NextResponse.json({ message: "Flashcard set deleted successfully" }, { status: 200 });
	} catch (error) {
        console.error('Error deleting flashcard set:', error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// PUT (edit) a flashcard set
export async function PUT(request) {
	const { flashcardSetId, title, userId } = await request.json();

	if (!flashcardSetId || !title || !userId) {
		return NextResponse.json({ error: "Set ID, Title, and User ID are required" }, { status: 400 });
	}

	try {
		const flashcardSetRef = doc(db, "FlashcardSets", flashcardSetId);
		const flashcardSetSnapshot = await getDoc(flashcardSetRef);

		if (!flashcardSetSnapshot.exists()) {
			return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 });
		}

		const flashcardSetData = flashcardSetSnapshot.data();

		if (flashcardSetData.userId !== userId) {
			return NextResponse.json({ error: "You cannot delete a flashcard set that is not yours" }, { status: 403 });
		}

		await updateDoc(flashcardSetRef, {
			title,
			updatedAt: serverTimestamp(),
		});

		const updatedSetRef = await getDoc(flashcardSetRef);
		const updatedSetData = updatedSetRef.data();

		return NextResponse.json(updatedSetData, { status: 200 });
	} catch (error) {
        console.error('Error updating flashcard set:', error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
