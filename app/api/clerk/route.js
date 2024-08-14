import { db } from "@/firebase";
import { collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { id, fullName, firstName, email, imageUrl } = await request.json();

        if (!id || !fullName || !email) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
        }

        // create user in Firestore
        const userRef = doc(collection(db, 'Users'), id);
        await setDoc(userRef, {
            fullName,
            firstName,
            email,
            avatar: imageUrl || null,
            subscriptionPlan: 'w5vbPGwIq6QrggvGOKAE',
            aiFlashcardsUsedThisMonth: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const newUserRef = await getDoc(userRef);
        const newUserData = newUserRef.data();

        console.log('newUserData:', newUserData);

        return NextResponse.json(newUserData, { status: 200 });
    } catch (error) {
        console.error('Error with Clerk handling:', error);
        return NextResponse.json({ error: 'Failed to add user to Firestore' }, { status: 500 });
    }
}
