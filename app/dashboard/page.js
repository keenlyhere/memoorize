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
  return (
    <MainLayout>
        {/* to-do: dashboard content */}
        <h1>Dashboard content will go here</h1>
    </MainLayout>
  )
}
