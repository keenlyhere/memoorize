import { db } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET user's subscription plan
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const userRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const subscriptionPlanId = userData.subscriptionPlan;

        const subscriptionPlanRef = doc(db, 'SubscriptionPlans', subscriptionPlanId);
        const subscriptionPlanSnapshot = await getDoc(subscriptionPlanRef);

        if (!subscriptionPlanSnapshot.exists()) {
            return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
        }

        const subscriptionPlanData = subscriptionPlanSnapshot.data();

        const userPlanName = subscriptionPlanData.name;

        const data = {
            subscriptionPlanName: userPlanName,
            subscriptionPlanId,
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error getting user subscription plan:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
