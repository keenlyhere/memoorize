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
    const { courses } = useAppSelector((state) => state.courses);
    const [ isLoaded, setIsLoaded ] = useState(false);

    const [totalFlashcardSets, setTotalFlashcardSets] = useState(0);
    const [totalFlashcards, setTotalFlashcards] = useState(0);
    const [flashcardsDueToday, setFlashcardsDueToday] = useState(0);
    const [recentActivity, setRecentActivity] = useState([]);


    useEffect(() => {
        if (currUser && currUser.isAuthenticated) {
            dispatch(getUserCourses(currUser.id))
                .unwrap()
                .then(() => {
                    fetchDashboardData();
                    setIsLoaded(true);
                })
                .catch((error) => {
                    console.error("Failed to load courses:", error);
                    setIsLoaded(true); // Ensure loading state is handled even on failure
                });
        }
    }, [currUser, dispatch]);

    const fetchDashboardData = async () => {
        try {
            const flashcardSetsQuery = query(
                collection(db, 'FlashcardSets'),
                where('userId', '==', currUser.id)
            );
            const flashcardSetsSnapshot = await getDocs(flashcardSetsQuery);
            setTotalFlashcardSets(flashcardSetsSnapshot.size);

            let flashcardCount = 0;
            let dueTodayCount = 0;
            let activities = [];

            const today = new Date().setHours(0, 0, 0, 0);

            for (const setDoc of flashcardSetsSnapshot.docs) {
                const flashcardsQuery = query(
                    collection(db, 'Flashcards'),
                    where('setId', '==', setDoc.id),
                    where('userId', '==', currUser.id)
                );
                const flashcardsSnapshot = await getDocs(flashcardsQuery);
                flashcardCount += flashcardsSnapshot.size;

                flashcardsSnapshot.forEach((flashcardDoc) => {
                    const flashcardData = flashcardDoc.data();
                    const nextReviewDate = new Date(flashcardData.nextReviewDate).setHours(0, 0, 0, 0);
                    if (nextReviewDate === today) {
                        dueTodayCount += 1;
                    }
                    activities.push({
                        activity: `Reviewed flashcard from set ${setDoc.data().title}`,
                        lastReviewedAt: flashcardData.lastReviewedAt
                    });
                });
            }

            setTotalFlashcards(flashcardCount);
            setFlashcardsDueToday(dueTodayCount);

            // Sort activities by last reviewed time
            activities.sort((a, b) => new Date(b.lastReviewedAt) - new Date(a.lastReviewedAt));
            setRecentActivity(activities.slice(0, 5)); // Display only the most recent 5 activities

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    return (
        <MainLayout>
            {isLoaded ? (
                <>
                    <div className="p-3"></div>
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-medium text-dark-gray py-3">Dashboard</h1>
                    </div>

                    {/* stats overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 h-40">
                        <div className="bg-white p-6 rounded-lg border flex flex-col">
                            <h2 className="text-lg font-semibold text-dark-gray">Total Courses</h2>
                            <div className="grow content-center">
                                <p className="text-6xl font-bold text-primary-purple">
                                    {courses.length}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border">
                            <h2 className="text-lg font-semibold text-dark-gray">Total Flashcard Sets</h2>
                            <p className="text-2xl font-bold text-primary-purple">
                                {totalFlashcardSets}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border">
                            <h2 className="text-lg font-semibold text-dark-gray">Total Flashcards</h2>
                            <p className="text-2xl font-bold text-primary-purple">
                                {totalFlashcards}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 h-40 w-full">
                        {/* upcoming reviews */}
                        <div className="bg-white p-6 rounded-lg border mb-6 col-span-1 h-full">
                            <h2 className="text-lg font-semibold text-dark-gray">Flashcards due today:</h2>
                            <p className="text-4xl font-bold text-primary-purple">
                                {flashcardsDueToday}
                            </p>
                        </div>
                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-lg border mb-6 h-full col-span-2">
                            <h2 className="text-lg font-semibold text-dark-gray">Recent Activity</h2>
                            <ul className="space-y-3">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <li key={index} className="flex justify-between">
                                            <span className="text-muted-pink">
                                                {activity.activity}
                                            </span>
                                            <span className="text-muted-purple">
                                                {new Date(activity.lastReviewedAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No recent activity</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </MainLayout>
    );
}
