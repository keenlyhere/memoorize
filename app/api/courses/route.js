import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { title, userId } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
        }

        const newCourseDocRef = await addDoc(collection(db, 'Courses'), {
            title,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await updateDoc(newCourseDocRef, {
            id: newCourseDocRef.id
        });

        return NextResponse.json({ success: 'Course added' }, { status: 200 });
    } catch (error) {
        console.error('Error adding course:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
