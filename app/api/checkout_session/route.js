import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const formatAmountForStripe = (amount) => {
//   return Math.round(amount * 100); // Convert to cents
// };

//POST for payment
export async function POST(req) {
  const { planName, planPrice, planFeatures, planId } = await req.json();

  let priceInCents;

  if (typeof planPrice === "string") {
    // Remove "$" and "/month" if planPrice is a string
    priceInCents = Math.round(
      parseFloat(planPrice.replace("$", "").replace("/month", "")) * 100
    );
  } else if (typeof planPrice === "number") {
    // Directly use the number and round it
    priceInCents = Math.round(planPrice * 100);
  } else {
    // Handle unexpected data type
    throw new Error("Invalid planPrice data type");
  }

  const params = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: planName,
          },
          unit_amount: priceInCents,
          recurring: {
            interval: "month",
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      planId,
    },
    success_url: `${req.headers.get(
      "origin"
    )}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get(
      "origin"
    )}/result?session_id={CHECKOUT_SESSION_ID}`,
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession, { status: 200 });
} catch (error) {
    console.error("Error creating checkout session:", {
        message: error.message,
        type: error.type,
        param: error.param,
        detail: error.detail,
        headers: error.headers,
    });
    return NextResponse.json(
        { error: { message: error.message } },
        { status: 500 }
    );
}
}

//GET session
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
