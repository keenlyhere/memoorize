import { db } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET all courses
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const coursesCollection = collection(db, 'Courses');
    const coursesQuery = query(
        coursesCollection,
        where('userId', '==', userId),
        orderBy('title', 'asc'),
    );
    const coursesSnapshot = await getDocs(coursesQuery);

    const courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST (add) a course
export async function POST(request) {
    try {
        const { title, userId } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
        }

        const newCourseDocRef = await addDoc(collection(db, 'Courses'), {
            title,
            userId,
            setCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await updateDoc(newCourseDocRef, {
            id: newCourseDocRef.id
        });

        const newCourseRef = await getDoc(newCourseDocRef);
        const newCourseData = newCourseRef.data();

        return NextResponse.json(newCourseData, { status: 200 });
    } catch (error) {
        console.error('Error adding course:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a course
export async function DELETE(request) {
    const { courseId, userId } = await request.json();

    if (!courseId) {
        console.log('courseId:', courseId);
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    try {
        const courseDocRef = doc(db, 'Courses', courseId);
        const courseDoc = await getDoc(courseDocRef);
        const courseData = courseDoc.data();

        if (userId !== courseData.userId) {
            return NextResponse.json({ error: 'You cannot delete a course that is not yours' }, { status: 403 });
        }

        await deleteDoc(courseDocRef);

        return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting course:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

// PUT (edit) a course
export async function PUT(request) {
  const { courseId, title } = await request.json();

  if (!courseId || !title) {
    return NextResponse.json({ error: 'Course ID and title are required' }, { status: 400 });
  }

  try {
    const courseRef = doc(db, 'Courses', courseId);
    await updateDoc(courseRef, {
      title,
      updatedAt: serverTimestamp(),
    });

    const updatedCourse = await getDoc(courseRef);
    const updatedCourseData = updatedCourse.data();

    return NextResponse.json(updatedCourseData, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
