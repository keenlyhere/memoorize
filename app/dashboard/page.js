'use client'
import MainLayout from "@/components/MainLayout";
import { db } from "@/firebase";
import { getUserCourses } from "@/lib/features/courses/coursesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { doc, collection, getDocs, getDoc, setDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const currUser = useAppSelector((state) => state.user);
    const { courses, status } = useAppSelector((state) => state.courses);
    const [ isLoaded, setIsLoaded ] = useState(false);

    useEffect(() => {
        if (currUser && status !== 'succeeded') {
            dispatch(getUserCourses(currUser.id));
        }
    }, [currUser, status, dispatch]);

    useEffect(() => {
      if (courses && courses.length > 0) {
        setIsLoaded(true);
        console.log('courses:', courses);
      }
    }, [courses, setIsLoaded])
    return (
         <MainLayout>
            { isLoaded ? (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-medium text-dark-gray py-3">Dashboard</h1>
                    </div>

                    {/* stats overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 h-40">
                        <div className="bg-white p-6 rounded-lg border flex flex-col">
                            <h2 className="text-lg font-semibold text-dark-gray">Total Courses</h2>
                            <div className="grow content-center">
                                <p className="text-6xl font-bold text-primary-purple">
                                    { courses.length }
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border">
                            <h2 className="text-lg font-semibold text-dark-gray">Total Flashcard Sets</h2>
                            <p className="text-2xl font-bold text-primary-purple">
                                {/* to-do: dynamically render total flashcard sets */}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border">
                            <h2 className="text-lg font-semibold text-dark-gray">Total Flashcards</h2>
                            <p className="text-2xl font-bold text-primary-purple">
                                {/* to-do: dynamically render total flashcards */}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 h-40 w-full">
                        {/* upcoming reviews */}
                        <div className="bg-white p-6 rounded-lg border mb-6 col-span-1 h-full">
                            <h2 className="text-lg font-semibold text-dark-gray">Flashcards due today:</h2>
                            <p className="text-4xl font-bold text-primary-purple">
                                {/* to-do: dynamically render flashcards due */}
                            </p>
                        </div>
                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-lg border mb-6 h-full col-span-2">
                            <h2 className="text-lg font-semibold text-dark-gray">Recent Activity</h2>
                            <ul className="space-y-3">
                            <li className="flex justify-between">
                                <span className="text-muted-pink">
                                    {/* to-do: dynamically render recent activity item */}
                                </span>
                                <span className="text-muted-purple">
                                    {/* to-do: dynamically render time last reviewed */}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-pink">
                                    {/* to-do: dynamically render recent activity item */}
                                </span>
                                <span className="text-muted-purple">
                                    {/* to-do: dynamically render time last reviewed */}
                                </span>
                            </li>
                            {/* More recent activity items */}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            ) }
    </MainLayout>
    )
}
