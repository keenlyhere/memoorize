"use client";
import MainLayout from "@/components/MainLayout";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import AddFlashcardForm from "@/components/AddFlashcardForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import {
  getFlashcards,
  removeFlashcard,
  updateFlashcard,
} from "@/lib/features/flashcards/flashcardsSlice";
import { getCourseSets } from "@/lib/features/flashcardSets/flashcardSetsSlice";
import { getSingleCard } from "@/lib/features/flashcards/flashcardsSlice";

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

export default function Set({ params }) {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector((state) => state.user);
  const courseId = params.courseSlug;
  const setId = params.setSlug;
  const { flashcards, flashcardSetTitle, status } = useAppSelector((state) => state.flashcards);
  const { flashcardSets } = useAppSelector((state) => state.flashcardSets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingFlashcardId, setEditingFlashcardId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [viewMode, setViewMode] = useState("all"); // 'all' or 'study'

  //test for get single card
//   const flashcardId = "4kCgskZQshf65xo2Rh8x";
//   const singleCard = useAppSelector((state) =>
// 	state.flashcards.flashcards.find((card) => card.id === flashcardId)
//   );
//   useEffect(() => {
//     const userId = currUser.id;
//     dispatch(getSingleCard({ flashcardId, userId }));
//   }, [dispatch, currUser.id]);
//   useEffect(() => {
//     console.log("singleCard:", singleCard);
// }, [singleCard]);

  // fetch flashcards from this set
  useEffect(() => {
    if (currUser && currUser.isAuthenticated && setId) {
      dispatch(getFlashcards({ setId, userId: currUser.id }))
	  	.unwrap()
		.then(() => {
			setIsLoaded(true);
		});
    }
  }, [currUser, setId, setIsLoaded, dispatch]);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleDeleteClick = (flashcardId) => {
    openModal(
      <DeleteConfirmation
        onConfirm={() => handleDelete(flashcardId)}
        onClose={closeModal}
      />
    );
  };

  const handleDelete = async (flashcardId) => {
    dispatch(removeFlashcard({ flashcardId, userId: currUser.id }))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to delete flashcard:", error);
      });
  };

  const handleEditClick = (flashcard) => {
    setEditingFlashcardId(flashcard.id);
    setEditedQuestion(flashcard.question);
    setEditedAnswer(flashcard.answer);
  };

  const handleFieldChange = (e, field) => {
    if (field === "question") {
      setEditedQuestion(e.target.value);
    } else if (field === "answer") {
      setEditedAnswer(e.target.value);
    }
  };

  const handleFieldSubmit = (flashcardId) => {
    dispatch(
      updateFlashcard({
        id: flashcardId,
        question: editedQuestion,
        answer: editedAnswer,
        userId: currUser.id,
      })
    )
      .unwrap()
      .then(() => {
        setEditingFlashcardId(null);
      })
      .catch((error) => {
        console.error("Failed to update flashcard:", error);
      });
  };

  const handleFieldBlur = (flashcardId, originalQuestion, originalAnswer) => {
    if (
      editedQuestion !== originalQuestion ||
      editedAnswer !== originalAnswer
    ) {
      handleFieldSubmit(flashcardId);
    } else {
      setEditingFlashcardId(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleDifficultyUpdate = (flashcardId, difficulty) => {
    const now = new Date();
    const nextReviewDate = calculateNextReviewDate(difficulty);

    dispatch(
      updateFlashcard({
        id: flashcardId,
        difficulty,
        lastReviewedAt: now.toISOString(),
        nextReviewDate: nextReviewDate.toISOString(),
        userId: currUser.id,
      })
    )
      .unwrap()
      .then(() => {
        console.log("Difficulty and next review date updated successfully");
      })
      .catch((error) => {
        console.error("Failed to update difficulty:", error);
      });
  };

  return (
    <MainLayout>
      {isLoaded ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-dark-gray py-2">
              { flashcardSetTitle }
            </h1>
            <button
              onClick={() =>
                openModal(
                  <AddFlashcardForm
                    onClose={closeModal}
                    userId={currUser.id}
                    setId={setId}
                  />
                )
              }
              className="bg-primary-purple text-white py-2 px-4 rounded-lg flex gap-2 items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Flashcard
            </button>
          </div>
          <div className="w-full">
            {/* to-do: display flashcards here */}

            {viewMode === "all" ? (
              <div className="flex flex-col w-full items-center justify-between py-4">
                {flashcards && flashcards.length > 0 ? (
                  flashcards.map((flashcard) => (
                    <div
                      key={flashcard.id}
                      className="w-full flex p-6 border-b hover:bg-accent-pink/10"
                    >
                      <div className="flex w-full items-center space-x-4 grow">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col grow">
                            {editingFlashcardId === flashcard.id ? (
                              <>
                                <input
                                  type="text"
                                  value={editedQuestion}
                                  onChange={(e) =>
                                    handleFieldChange(e, "question")
                                  }
                                  onBlur={() =>
                                    handleFieldBlur(
                                      flashcard.id,
                                      flashcard.question,
                                      flashcard.answer
                                    )
                                  }
                                  className="text-lg w-3/4 font-semibold text-dark-gray bg-light-gray p-1 rounded focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple"
                                  autoFocus
                                />
                                <textarea
                                  value={editedAnswer}
                                  onChange={(e) =>
                                    handleFieldChange(e, "answer")
                                  }
                                  onBlur={() =>
                                    handleFieldBlur(
                                      flashcard.id,
                                      flashcard.question,
                                      flashcard.answer
                                    )
                                  }
                                  className="text-lg w-3/4 font-semibold text-dark-gray bg-light-gray p-1 rounded focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple mt-2"
                                  rows="3"
                                />
                              </>
                            ) : (
                              <>
                                <span
                                  className="text-lg font-semibold text-dark-gray"
                                  onClick={() => handleEditClick(flashcard)}
                                >
                                  {flashcard.question}
                                </span>
                                <p className="text-sm text-gray-500">
                                  {flashcard.answer}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          className="text-gray-500 hover:text-primary-purple"
                          onClick={() => handleEditClick(flashcard)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(flashcard.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="dark:text-dark-gray">
                    You have no flashcards. Click the &apos;+ Flashcard&apos;
                    button to add a flashcard!
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="text-center p-6 bg-light-gray rounded-lg shadow-md">
                  <p className="text-lg font-semibold text-dark-gray">
                    Study Mode
                  </p>
                  {flashcards && flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                      <div
                        key={flashcard.id}
                        className="relative w-full h-64 p-6 mt-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:shadow-md"
                        onClick={() => handleDifficultyUpdate(flashcard.id)}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <p className="text-lg font-semibold text-dark-gray">
                            {flashcard.question}
                          </p>
                        </div>
                        {/* Overlay for Answer */}
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
                          style={{
                            transform: `rotateY(${
                              index % 2 === 0 ? "180deg" : "0deg"
                            })`,
                          }}
                        >
                          <p className="text-sm text-gray-500">
                            {flashcard.answer}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="dark:text-dark-gray">
                      No flashcards available.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* modal */}
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {modalContent}
          </Modal>
        </>
      ) : (
        <p className="dark:text-dark-gray">Loading...</p>
      )}
    </MainLayout>
  );
}
