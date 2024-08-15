import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET a single course by courseId
export async function GET(request, { params }) {
  const { courseID } = params;

  if (!courseID) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }

  try {
    const courseDocRef = doc(db, 'Courses', courseID);
    const courseDoc = await getDoc(courseDocRef);

    if (!courseDoc.exists()) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseData = { id: courseDoc.id, ...courseDoc.data() };
    return NextResponse.json(courseData, { status: 200 });
  } catch (error) {
    console.error('Error fetching course:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
