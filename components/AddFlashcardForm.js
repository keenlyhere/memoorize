'use client'
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addFlashcard } from "@/lib/features/flashcards/flashcardsSlice";
import { serverTimestamp, getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase"; // Assuming your Firestore instance is exported from here

export default function AddFlashcardForm({ userId, setId, onClose }) {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);
  const [richMedia, setRichMedia] = useState('');
  const [error, setError] = useState('');
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  const { flashcards } = useAppSelector((state) => state.flashcards);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
		  setUserData(userDoc.data());
          const subscriptionPlan = userData.subscriptionPlan;

          if (subscriptionPlan) {
            const planDoc = await getDoc(doc(db, 'SubscriptionPlans', subscriptionPlan));
            if (planDoc.exists()) {
              setPlanDetails(planDoc.data());
            } else {
              console.error('Subscription plan does not exist in Firestore');
              setError('Failed to load subscription plan.');
            }
          } else {
            console.error('User does not have a subscription plan');
            setError('Failed to load user subscription plan.');
          }
        } else {
          console.error('User does not exist in Firestore');
          setError('User not found.');
        }
      } catch (error) {
        console.error('Error fetching subscription plan:', error);
        setError('Error fetching subscription plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const flashcardCount = flashcards.length;
  const aiFlashcardCount = flashcards.filter(flashcard => flashcard.aiGenerated).length;

  const canAddFlashcard = planDetails.flashcardLimit === null || flashcardCount < planDetails.flashcardLimit;
  const canAddAiFlashcard = aiGenerated && (planDetails.aiFlashcardLimit === null || aiFlashcardCount < planDetails.aiFlashcardLimit);

  const handleAddFlashcard = async (e) => {
    e.preventDefault();

    if (!canAddFlashcard) {
      setError(`You have reached your flashcard limit of ${planDetails.flashcardLimit}.`);
      return;
    }

    if (aiGenerated && !canAddAiFlashcard) {
      setError(`You have reached your AI flashcard limit of ${planDetails.aiFlashcardLimit}.`);
      return;
    }

    if (aiGenerated) {
      if (aiDescription) {
        try {
          // Call your AI service here to generate the question and answer
          const generatedQuestion = `Generated question for ${aiDescription}`; // Placeholder
          const generatedAnswer = `Generated answer for ${aiDescription}`; // Placeholder

          const newFlashcard = {
            question: generatedQuestion,
            answer: generatedAnswer,
            setId,
            userId,
            aiGenerated,
            richMedia: planDetails.features.includes('Rich media flashcards') ? richMedia : null,
            difficulty: null,
            lastReviewedAt: null,
            nextReviewDate: null,
            reviewCount: 0,
          };

          await dispatch(addFlashcard(newFlashcard)).unwrap();
          onClose(); // Close the modal after adding the flashcard
        } catch (error) {
          setError('Failed to generate flashcard using AI.');
          console.error(error);
        }
      } else {
        setError('AI description is required.');
      }
    } else if (question && answer) {
      const newFlashcard = {
        question,
        answer,
        setId,
        userId,
        isAIGenerated,
        richMedia: planDetails.features.includes('Rich media flashcards') ? richMedia : null,
      };

      try {
        await dispatch(addFlashcard(newFlashcard)).unwrap();
        onClose(); // Close the modal after adding the flashcard
      } catch (error) {
        setError('Failed to add flashcard.');
        console.error(error);
      }
    } else {
      setError('Question and answer are required.');
    }
  };

  return (
    <form onSubmit={handleAddFlashcard}>
      {aiGenerated ? (
		 userData.aiFlashcardsUsedThisMonth < planDetails.aiFlashcardLimit ? (
			<div className="mb-4">
				<label htmlFor="aiDescription" className="block text-gray-700">AI Flashcard Description</label>
				<textarea
					id="aiDescription"
					className="w-full px-4 py-2 rounded border border-gray-300 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple"
					rows="4"
					value={aiDescription}
					onChange={(e) => setAiDescription(e.target.value)}
					placeholder="Describe the topic for the AI to generate a flashcard"
				/>
			</div>
		) : (
			<div className="mb-4">
				<p className="dark:text-dark-gray">You have used up all your AI-generated flashcards for the month.</p>
			</div>
		)
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="question" className="block text-gray-700">Question</label>
            <input
              type="text"
              id="question"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple dark:text-dark-gray"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="answer" className="block text-gray-700">Answer</label>
            <textarea
              id="answer"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple dark:text-dark-gray"
              rows="4"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </>
      )}

      {planDetails.features.includes("Rich media flashcards") && !aiGenerated && (
        <div className="mb-4">
          <label htmlFor="richMedia" className="block text-gray-700">Rich Media (Optional)</label>
          <input
            type="text"
            id="richMedia"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple"
            value={richMedia}
            onChange={(e) => setRichMedia(e.target.value)}
            placeholder="URL to media (image, video, etc.)"
          />
        </div>
      )}

      {(planDetails.features.includes("Limited AI-Generated Flashcards") || planDetails.features.includes("Increased AI-Generated Flashcards")) && (
        <div className="mb-4">
          <label htmlFor="aiGenerated" className="inline-flex items-center">
            <input
              type="checkbox"
              id="aiGenerated"
              className="form-checkbox h-4 w-4 text-primary-purple"
              checked={aiGenerated}
              onChange={(e) => {
				setAiGenerated(e.target.checked)
				setIsAIGenerated(e.target.checked)
			}}
            />
            <span className="ml-2 text-gray-700">Use AI to generate flashcard</span>
          </label>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-muted-purple"
        >
          Add Flashcard
        </button>
      </div>
    </form>
  );
}
