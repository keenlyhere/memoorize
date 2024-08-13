'use client'
import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import Sidebar from "@/components/Sidebar";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, collection, getDocs, getDoc, setDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

// export default function Dashboard() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [ flashcardSets, setFlashcardSets ] = useState([]);

//     useEffect(() => {
//         const getFlashcards = async () => {
//             if (user) {
//                 // check if doc exists
//                 const docRef = doc(collection(db, 'Users'), user.id);
//                 const docSnap = await getDoc(docRef);
//                 console.log('userid:', user);

//                 if (docSnap.exists()) {
//                     // get all flashcard collection names
//                     const flashcardSetsQuery = query(collection(db, 'FlashcardSets'), where('userId', '==', user.id));
//                     const querySnapshot = await getDocs(flashcardSetsQuery);

//                     if (!querySnapshot.empty) {
//                         const flashcardSetsArray = [];
//                         querySnapshot.forEach((doc) => {
//                             flashcardSetsArray.push(doc.data());
//                         })
//                         setFlashcardSets(flashcardSetsArray);
//                     }
//                 } else {
//                     // create flashcard
//                     await setDoc(docRef,{ name: user.firstName, avatar: user.imageUrl, email: user.emailAddresses[0].emailAddress, createdAt: serverTimestamp() })
//                 }
//             }
//         }

//         getFlashcards();
//     }, [user])

//     if (!isLoaded || !isSignedIn) {
//         return null;
//     }

//     return (
//         <div className="flex flex-col justify-center items-center bg-gradient-to-r h-screen text-light-gray font-sans">
//             { flashcardSets?.length ? (
//                 flashcardSets?.map((flashcardSet) => (
//                     <div>
//                         <h3>{ flashcardSet.title }</h3>
//                     </div>
//                 ))
//             ) : ("") }
//         </div>
//     )
// }

export default function Dashboard() {
    const { isLoaded } = useUser();
    return isLoaded ? (
        <MainLayout>
            <h1 className="text-xl font-medium text-dark-gray mb-6">Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 h-40">
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-dark-gray">Total Courses</h2>
                    <p className="text-2xl font-bold text-primary-purple">
                        {/* to-do: dynamically render total courses */}
                    </p>
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
                    <h2 className="text-xl font-bold text-dark-gray mb-4">Recent Activity</h2>
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

        </MainLayout>
    ) : (
        <MainLayout>
            <p>Loading...</p>
        </MainLayout>
    )
}
