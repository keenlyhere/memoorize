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
import BackButton from "@/components/BackButton";
import Flashcard from "@/components/Flashcard";
import Tabs from "@/components/Tabs";
import FlashcardCarousel from "@/components/FlashcardCarousel";
import {
  startStudySession,
  resumeStudySession,
  endStudySession,
  getActiveStudySession,
} from "@/lib/features/studySessions/studySessionsSlice";

export default function Set({ params }) {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector((state) => state.user);
  const setId = params.setSlug;
  const courseId = params.courseSlug;
  const { flashcards, flashcardSetTitle, status } = useAppSelector((state) => state.flashcards);
  const { session } = useAppSelector((state) => state.sessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingFlashcardId, setEditingFlashcardId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [sessionId, setSessionId] = useState(null);
  const [existingSession, setExistingSession] = useState(null);

  // fetch flashcards from this set
  useEffect(() => {
    if (currUser && currUser.isAuthenticated && setId) {
      dispatch(getFlashcards({ setId, userId: currUser.id }))
        .unwrap()
        .then(() => {
          setIsLoaded(true);
        });

      // check for existing study session
      dispatch(getActiveStudySession({ userId: currUser.id, setId }))
        .unwrap()
        .then((session) => {
          if (session && ( session.status === 'paused' || session.status === 'active' )) {
            console.log('session.status:', session.status);
            setExistingSession(session);
          }
        })
    }
  }, [currUser, setId, setIsLoaded, setExistingSession, dispatch]);

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

  const handleSaveClick = (flashcardId, originalQuestion, originalAnswer) => {
    // don't dispatch update if no changes are made
    if (editedQuestion !== originalQuestion || editedAnswer !== originalAnswer) {
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
    }

    setEditingFlashcardId(null);
  };

  const handleCancelClick = () => {
    setEditingFlashcardId(null);
  };

  const handleViewModeChange = (mode) => {
    // setViewMode(mode);
    if (mode === 'study') {
      if (existingSession) {
        openModal(
          <div>
            <h2 className="font-lg font-semibold text-dark-gray">Resume Session?</h2>
            <p className="text-dark-gray">You have an existing paused session. Would you like to resume it?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg">
                Cancel
              </button>
              <button onClick={handleStartNewSession} className="px-4 py-2 bg-primary-purple text-white rounded-lg">
                Start a new session
              </button>
              <button onClick={handleResumeSession} className="px-4 py-2 bg-accent-pink text-white rounded-lg">
                Resume
              </button>
            </div>
          </div>
        )
      } else {
        openModal(
          <div>
            <h2 className="text-lg font-semibold text-dark-gray">Start a study session</h2>
            <p className="text-dark-gray">Are you ready to start a study session?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg">
                Maybe later
              </button>
              <button onClick={handleStartSession} className="px-4 py-2 bg-primary-purple text-white rounded-lg">
                Start
              </button>
            </div>
          </div>
        )
      }
    } else {
      setViewMode(mode);
    }
  };

  const handleStartSession = () => {
    dispatch(startStudySession({ userId: currUser.id, setId, courseId }))
      .unwrap()
      .then((newSession) => {
        setSessionId(newSession.id);
        setViewMode("study");
        closeModal();
      });
  };

  const handleResumeSession = () => {
    dispatch(resumeStudySession({ sessionId: session.id }))
      .unwrap()
      .then(() => {
        setSessionId(session.id);
        setViewMode("study");
        closeModal();
      });
  };

  const handleStartNewSession = () => {
    dispatch(endStudySession({ sessionId: existingSession.id }))
      .unwrap()
      .then(() => {
        handleStartSession();
      });
  };

  const handleSessionEnd = () => {
    setViewMode("all");
  };

  // if users try to navigate away from the page, show a warning
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (sessionId) {
  //       event.preventDefault();
  //       event.returnValue = "";
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     handleEndSession(); // End the session if the user navigates away
  //   };
  // }, [sessionId]);

  return (
    <MainLayout>
      {isLoaded ? (
        <>
		      <BackButton>Back</BackButton>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-dark-gray py-3">
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

          <Tabs activeTab={viewMode} onChange={handleViewModeChange} />

          <div className="w-full lg:h-fit h-full grow">
            {viewMode === "all" ? (
              <div className="flex flex-col w-full items-center justify-between pb-4">
                {flashcards && flashcards.length > 0 ? (
                  flashcards.map((flashcard) => (
                    <div key={flashcard.id} className="lg:px-6 w-full">
                      <Flashcard
                        question={flashcard.question}
                        answer={flashcard.answer}
                        isEditing={editingFlashcardId === flashcard.id}
                        editedQuestion={editedQuestion}
                        editedAnswer={editedAnswer}
                        onQuestionChange={setEditedQuestion}
                        onAnswerChange={setEditedAnswer}
                        onEditClick={() => handleEditClick(flashcard)}
                        onDeleteClick={() => handleDeleteClick(flashcard.id)}
                        onSaveClick={() => handleSaveClick(flashcard.id, flashcard.question, flashcard.answer)}
                        onCancelClick={handleCancelClick}
                      />
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
              <div className="w-full lg:h-fit h-full flex justify-center">
                <div className="w-full h-full grow text-center px-6">
                  {flashcards && flashcards.length > 0 && sessionId && (
                      <FlashcardCarousel
                        sessionId={sessionId}
                        flashcards={flashcards}
                        currUser={currUser}
                        initialIndex={session?.currentFlashcardIndex || 0}
                        onSessionEnd={handleSessionEnd}
                      />
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
