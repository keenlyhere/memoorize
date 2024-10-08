"use client";

import { clearUser, setUser } from "@/lib/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import getStripe from "@/utils/get-stripe";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase";
import {  useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, isLoaded, isSignedIn } = useUser();
  const currUser = useAppSelector((state) => state.user);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [plans, setPlans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (user && isSignedIn) {
        // dispatch user information to redux store
        dispatch(
          setUser({
            id: user.id,
            fullName: user.fullName,
            firstName: user.firstName,
            email: user.primaryEmailAddress?.emailAddress,
            avatar: user.imageUrl,
          })
        );
      } else {
        // clear user information in Redux store if not signed in
        dispatch(clearUser());
      }
    }
  }, [isLoaded, user, isSignedIn, dispatch]);

  useEffect(() => {
    if (currUser && currUser.isAuthenticated) {
      setIsUserLoaded(true);
    }
  }, [currUser]);

  //fetch plans to get id
  useEffect(() => {
    const fetchPlans = async () => {
      const querySnapshot = await getDocs(collection(db, "SubscriptionPlans"));
      const plansArray = [];
      querySnapshot.forEach((doc) => {
        plansArray.push({ id: doc.id, ...doc.data() });
      });
      setPlans(plansArray);

    };

    fetchPlans();
  }, []);


  //pricing object for dynamic rendering
  const pricingPlans = [
    {
      name: "Free",
      price: "$0/month",
      features: [
        { amount: "50", feature: "Flashcards" },
        { amount: "5", feature: "Sets" },
        { amount: "3", feature: "Courses" },
        { amount: "5", feature: "AI-Generated Flashcards per Month" },
      ],
      buttonText: "Start Free",
      buttonLink: "#",
    },
    {
      name: "Basic",
      price: "$9.99/month",
      features: [
        { amount: "500", feature: "Flashcards" },
        { amount: "50", feature: "Sets" },
        { amount: "10", feature: "Courses" },
        { amount: "50", feature: "AI-Generated Flashcards per Month" },
      ],
      buttonText: "Start Basic",
      buttonLink: "#",
    },
    {
      name: "Pro",
      price: "$19.99/month",
      features: [
        { amount: "Unlimited", feature: "Flashcards" },
        { amount: "Unlimited", feature: "Sets" },
        { amount: "Unlimited", feature: "Courses" },
        { amount: "500", feature: "AI-Generated Flashcards per Month" },
      ],
      buttonText: "Start Pro",
      buttonLink: "#",
    },
  ];

  const handleSubmit = async (selectedPlan) => {
    //redirect to sign up if plan is free
    if (selectedPlan.name === "Free") {
      router.push("/sign-up");
      return;
    }

    //find the selected plan id based on name
    const plan = plans.find((p) => p.name.toLowerCase() === selectedPlan.name.toLowerCase());
    console.log('plan', plan)

    if (!plan) {
      console.error("Selected plan not found");
      return;
    }

    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planName: plan.name,
        planPrice: plan.price,
        planFeatures: plan.features,
        planId: plan.id
      }),
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <div className="bg-light-gray text-dark-gray font-sans">
      {/* Header */}
      <header className="bg-light-gray text-dark-gray py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <a href="/">
            <h1 className="text-3xl font-bold">
              me
              <span className="bg-gradient-to-l text-transparent bg-clip-text inline-block">
                moo
              </span>
              rize
            </h1>
          </a>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="hover:text-accent-pink">
              Features
            </a>
            <a href="#pricing" className="hover:text-accent-pink">
              Pricing
            </a>
            {/* <a href="#" className="hover:text-accent-pink">
              Contact
            </a> */}

            {isLoaded && isUserLoaded ? (
              <a
                href="/dashboard"
                className="bg-gradient-to-r text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/sign-in"
                  className="text-primary-purple py-2 px-4 border border-primary-purple rounded-lg hover:text-muted-purple hover:border-muted-purple"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="bg-gradient-to-r text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l"
                >
                  Sign Up
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-light-gray text-left py-20 text-dark-gray">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <h2 className="text-6xl font-bold mb-4">
                Develop Your Skills with AI-Powered Flashcards
              </h2>
              <p className="text-xl mb-8">
                memoorize helps you turn your text into interactive flashcards,
                making learning more engaging and effective.
              </p>
              <a
                href="#"
                className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-3 px-8 rounded-lg hover:bg-gradient-to-l"
              >
                Get Started
              </a>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              {/* to-do: add hero image */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-l py-20" id="features">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-8 text-light-gray">
            Why Choose me<span className="text-muted-purple">moo</span>rize?
          </h3>
          <div className="flex flex-wrap -mx-4 h-max">
            <div className="w-full md:w-1/3 md:px-4 px-8 mb-8 grow">
              <div className="p-8 bg-white rounded-lg shadow-lg h-full">
                <h4 className="text-2xl font-bold mb-4">
                  AI-Powered Flashcards
                </h4>
                <p>
                  Our AI turns your text into flashcards in seconds, making
                  study sessions more productive.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:px-4 px-8 mb-8 grow">
              <div className="p-8 bg-white rounded-lg shadow-lg h-full">
                <h4 className="text-2xl font-bold mb-4">
                  Customizable Learning
                </h4>
                <p>
                  Tailor your flashcards to your specific learning needs,
                  ensuring you get the most out of your study time.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:px-4 px-8 mb-8 grow">
              <div className="p-8 bg-white rounded-lg shadow-lg h-full">
                <h4 className="text-2xl font-bold mb-4">Track Your Progress</h4>
                <p>
                  Monitor your learning journey and see how much you&apos;ve
                  improved over time with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Pricing Section */}
<section className="py-20 text-dark-gray" id="pricing">
  <div className="px-4 text-center w-full">
    <h3 className="text-4xl font-bold mb-8">Affordable Pricing Plans</h3>
    <div className="flex flex-wrap w-full">
      {pricingPlans.map((singlePlan) => (
        <div key={singlePlan.name} className="w-full md:w-1/3 md:px-4 px-8 mb-8">
          <div className="p-8 bg-white rounded-lg shadow-sm text-dark-gray w-full">
            <h4 className="text-2xl font-bold mb-4">{singlePlan.name}</h4>
            <p className="text-xl">{singlePlan.price}</p>
            <ul className="mt-4 text-left">
              {singlePlan.features.map((feature, index) => (
                <li key={index} className="py-4 px-2 flex justify-between [&:not(:last-child)]:border-b">
                  <span className="w-2/3">{feature.feature}</span> <span className="text-primary-purple font-semibold">{feature.amount}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubmit(singlePlan)}
              className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block"
            >
              {singlePlan.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/*old pricing section*/}
      {/* <section className="py-20 text-dark-gray">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-8">Affordable Pricing Plans</h3>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-sm text-dark-gray">
                <h4 className="text-2xl font-bold mb-4">Free</h4>
                <p className="text-xl">$0/month</p>
                <ul className="mt-4 text-left">
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      50
                    </span>{" "}
                    Flashcards
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">5</span>{" "}
                    Sets
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">3</span>{" "}
                    Courses
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">5</span>{" "}
                    AI-Generated Flashcards per Month
                  </li>
                </ul>
                <a
                  href="#"
                  className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-sm text-dark-gray">
                <h4 className="text-2xl font-bold mb-4">Basic</h4>
                <p className="text-xl">$9.99/month</p>
                <ul className="mt-4 text-left">
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      500
                    </span>{" "}
                    Flashcards
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      50
                    </span>{" "}
                    Sets
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      10
                    </span>{" "}
                    Courses
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      50
                    </span>{" "}
                    AI-Generated Flashcards per Month
                  </li>
                </ul>
                <a
                  href="#"
                  className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4">
              <div className="p-8 bg-white rounded-lg shadow-sm text-dark-gray">
                <h4 className="text-2xl font-bold mb-4">Pro</h4>
                <p className="text-xl">$19.99/month</p>
                <ul className="mt-4 text-left">
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      Unlimited
                    </span>{" "}
                    Flashcards
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      Unlimited
                    </span>{" "}
                    Sets
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      Unlimited
                    </span>{" "}
                    Courses
                  </li>
                  <li className="mb-2">
                    <span className="text-primary-purple font-semibold">
                      500
                    </span>{" "}
                    AI-Generated Flashcards per Month
                  </li>
                </ul>
                <a
                  href="#"
                  className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gradient-to-l bg-dark-gray text-white py-6">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 memoorize. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
