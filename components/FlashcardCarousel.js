"use client";
import { useState } from "react";
import StudyCard from "./StudyCard";
import FlashcardDifficulty from "./FlashcardDifficulty";
import { useAppDispatch } from "@/lib/hooks";
import { updateFlashcard } from "@/lib/features/flashcards/flashcardsSlice";
import Modal from "./Modal";
import { updateStudySession } from "@/lib/features/studySessions/studySessionsSlice";
import { endStudySession } from "@/lib/features/studySessions/studySessionsSlice";

const calculateNextReviewDate = (difficulty) => {
  const now = new Date();
  let nextReviewDate = new Date(now);

  switch (difficulty) {
    case "easy":
      nextReviewDate.setDate(now.getDate() + 3);
      break;
    case "medium":
      nextReviewDate.setDate(now.getDate() + 2);
      break;
    case "hard":
    default:
      nextReviewDate.setDate(now.getDate() + 1);
      break;
  }

  return nextReviewDate;
};

export default function FlashcardCarousel({
  sessionId,
  flashcards,
  currUser,
  initialIndex,
  onSessionEnd,
}) {
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [flipped, setFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [navigateDirection, setNavigateDirection] = useState(null);
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);

  const totalCards = flashcards.length;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAnswerRevealed(false);
  };

  const openEndSessionModal = () => {
    setIsEndSessionModalOpen(true);
  };

  const closeEndSessionModal = () => {
    setIsEndSessionModalOpen(false);
    onSessionEnd();
  };

  const handleNext = () => {
    if (answerRevealed) {
      openModal();
      setNavigateDirection("next");
    } else {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
        setAnswerRevealed(false);
      }
    }
  };

  const handlePrevious = () => {
    if (answerRevealed) {
      openModal();
      setNavigateDirection("previous");
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setFlipped(false);
        setAnswerRevealed(false);
      }
    }
  };

  const flipCard = () => {
    if (!flipped) {
      setFlipped(true);
      setAnswerRevealed(true);
    } else {
      openModal();
    }
  };

  const currentCard = flashcards[currentIndex];

  const handleDifficultyUpdate = (difficulty) => {
    const now = new Date().toISOString();
    const flashcardId = flashcards[currentIndex].id;
    const nextReviewDate = calculateNextReviewDate(difficulty);
    console.log("date set as 'now'", now)

    dispatch(
      updateFlashcard({
        id: flashcardId,
        difficulty,
        lastReviewedAt: now,
        nextReviewDate: nextReviewDate.toISOString(),
        userId: currUser.id,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          updateStudySession({
            sessionId,
            flashcardId,
            difficulty,
            reviewTime: now,
            currentFlashcardIndex: currentIndex + 1,
          })
        );

        closeModal();

        if (
          navigateDirection === "next" &&
          currentIndex < flashcards.length - 1
        ) {
          setCurrentIndex(currentIndex + 1);
        } else if (navigateDirection === "previous" && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }

        setFlipped(false);
        setAnswerRevealed(false);
        setNavigateDirection(null);

        if (currentIndex === totalCards - 1) {
          // end session when finished all cards
          endSession();
        }
      })
      .catch((error) => {
        console.error("Failed to update difficulty:", error);
      });
  };

  const endSession = () => {
    if (sessionId) {
      dispatch(endStudySession({ sessionId }))
        .unwrap()
        .then(() => {
          console.log("Study session ended.");
          openEndSessionModal();
        })
        .catch((error) => {
          console.error("Failed to end the session:", error);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <StudyCard
        question={currentCard.question}
        answer={currentCard.answer}
        onFlip={flipCard}
        flipped={flipped}
      />

      {flipped && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <FlashcardDifficulty onDifficultySelect={handleDifficultyUpdate} />
        </Modal>
      )}

      <Modal isOpen={isEndSessionModalOpen} onClose={closeEndSessionModal}>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-dark-gray">
            Congratulations!
          </h2>
          <p className="text-dark-gray mt-2">
            You&apos;ve completed your study session. Great job!
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={closeEndSessionModal}
              className="px-4 py-2 bg-primary-purple text-white rounded-lg"
            >
              Done
            </button>
            <button
              onClick={() => setIsEndSessionModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg"
            >
              Continue Studying
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex items-center justify-between mt-4 w-2/3">
        <button
          onClick={handlePrevious}
          className={`p-3 rounded-full ${
            currentIndex === 0
              ? "bg-gray-400/75 cursor-not-allowed"
              : "bg-muted-purple text-white"
          }`}
          disabled={currentIndex === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12.707 15.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L8.414 10l4.293 4.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <p className="text-lg text-dark-gray">
          {currentIndex + 1} / {totalCards}
        </p>
        <button
          onClick={handleNext}
          className={`p-3 rounded-full ${
            currentIndex === totalCards - 1
              ? "bg-gray-400/75 cursor-not-allowed"
              : "bg-muted-purple text-white"
          }`}
          disabled={currentIndex === totalCards - 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
