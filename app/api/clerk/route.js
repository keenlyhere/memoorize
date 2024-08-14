import { db } from "@/firebase";
import { collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

// export async function POST(request) {
//     try {
//         const { id, fullName, firstName, email, imageUrl } = await request.json();

//         if (!id || !fullName || !email) {
//             return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
//         }

//         // create user in Firestore
//         const userRef = doc(collection(db, 'Users'), id);
//         await setDoc(userRef, {
//             fullName,
//             firstName,
//             email,
//             avatar: imageUrl || null,
//             subscriptionPlan: 'w5vbPGwIq6QrggvGOKAE',
//             aiFlashcardsUsedThisMonth: 0,
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//         });

//         const newUserRef = await getDoc(userRef);
//         const newUserData = newUserRef.data();

//         console.log('newUserData:', newUserData);

//         return NextResponse.json(newUserData, { status: 200 });
//     } catch (error) {
//         console.error('Error with Clerk handling:', error);
//         return NextResponse.json({ error: 'Failed to add user to Firestore' }, { status: 500 });
//     }
// }

export async function POST(request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local' }, { status: 400 });
    }

    // get headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ error: 'No svix headers' }, { status: 400 });
    }

    // get body
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // create new svix instance with secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (error) {
        console.error('Error verifying webhook:', error);
        return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 });
    }

    console.log('*** payload:\n', payload)

    try {
        const { id, last_name, first_name, email_addresses, image_url } = payload.data;

        if (!id || !email_addresses) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
        }

        // create user in Firestore
        const userRef = doc(collection(db, 'Users'), id);
        const fullName = `${first_name} ${last_name}`;
        await setDoc(userRef, {
            fullName,
            firstName: first_name,
            email: email_addresses[0].email_address,
            avatar: image_url || null,
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
