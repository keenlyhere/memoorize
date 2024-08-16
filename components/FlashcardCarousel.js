"use client";
import { useState } from "react";
import StudyCard from "./StudyCard";
import FlashcardDifficulty from "./FlashcardDifficulty";
import { useAppDispatch } from "@/lib/hooks";
import { updateFlashcard } from "@/lib/features/flashcards/flashcardsSlice";
import Modal from "./Modal";

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

export default function FlashcardCarousel({ flashcards, currUser }) {
	const dispatch = useAppDispatch();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const totalCards = flashcards.length;

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleNext = () => {
		if (currentIndex < flashcards.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const flipCard = () => {
		setFlipped(!flipped);
        if (!flipped) {
			openModal();
		}
	};

	const currentCard = flashcards[currentIndex];

	const handleDifficultyUpdate = (difficulty) => {
		const now = new Date().toISOString();
		const flashcardId = flashcards[currentIndex].id;
		const nextReviewDate = calculateNextReviewDate(difficulty);

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
				console.log("Difficulty and next review date updated successfully");
				if (currentIndex < flashcards.length - 1) {
					setCurrentIndex(currentIndex + 1);
					setFlipped(false);
				}
                closeModal();
			})
			.catch((error) => {
				console.error("Failed to update difficulty:", error);
			});
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			{/* <div className="relative w-11/12 max-w-md bg-gray-800 rounded-lg shadow-lg p-6 text-white">
        <div
          className={`relative w-full h-64 bg-white rounded-lg shadow-lg text-dark-gray p-6 cursor-pointer transition-transform duration-500 ${
            flipped ? "transform rotate-y-180" : ""
          }`}
          onClick={flipCard}
        >
          <div className={`absolute inset-0 flex items-center justify-center ${flipped ? "hidden" : "block"}`}>
            <p className="text-2xl">{currentCard.question}</p>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center ${flipped ? "block" : "hidden"}`}>
            <p className="text-2xl">{currentCard.answer}</p>
          </div>
        </div>
      </div> */}
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

			<div className="flex items-center justify-between mt-4 w-2/3">
				<button
					onClick={handlePrevious}
					className={`p-3 rounded-full ${
						currentIndex === 0 ? "bg-gray-400/75 cursor-not-allowed" : "bg-muted-purple text-white"
					}`}
					disabled={currentIndex === 0}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
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
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
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
