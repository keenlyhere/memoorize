"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);

          //get planid from metadata from post request checkout_session object
          const planId = sessionData.metadata?.planId;
          // update plan if successful
          if (sessionData.payment_status === "paid" && user) {
            const userRef = doc(db, "Users", user.id);
            await updateDoc(userRef, {
              subscriptionPlan: planId,
            });
          }
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred while fetching session data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-light-gray text-dark-gray">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-light-gray text-dark-gray">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-light-gray text-dark-gray font-sans">
      {session && session.payment_status ? (
        session.payment_status === "paid" ? (
          <>
            <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
            <p>Your payment was successful.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Payment Failed</h1>
            <p>Your payment could not be processed. Please try again.</p>
          </>
        )
      ) : (
        <p>Loading session details...</p>
      )}
       <button onClick={(()=>router.push("/"))} className="mt-4 bg-primary-purple text-white py-2 px-4 rounded-lg hover:bg-accent-pink">
        Back to Home
      </button>
    </div>
  );
};

export default ResultPage;
