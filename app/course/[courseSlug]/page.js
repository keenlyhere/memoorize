"use client";
import MainLayout from "@/components/MainLayout";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import AddCourseForm from "@/components/AddCourseForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getUserCourses,
  getSingleCourse,
} from "@/lib/features/courses/coursesSlice";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Link from "next/link";
import {
  getCourseSets,
  removeFlashcardSet,
  updateFlashcardSet,
} from "@/lib/features/flashcardSets/flashcardSetsSlice";

export default function Sets({ params }) {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector((state) => state.user);
  const courseId = params.courseSlug;
  const { courses } = useAppSelector((state) => state.courses);
  const { flashcardSets, status } = useAppSelector(
    (state) => state.flashcardSets
  );
  // const [ currCourse, setCurrCourse ] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedFlashcardSetId, setSelectedFlashcardSetId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingFlashcardSetId, setEditingFlashcardSetId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const currCourse = useAppSelector((state) => state.courses.currCourse);
  useEffect(() => {
    if (currUser && currUser.id !== null && courseId) {
      dispatch(getSingleCourse(courseId));
    }
  }, [currUser, courseId, dispatch]);

  useEffect(() => {
    if (currCourse && currCourse.id === courseId) {
      dispatch(getCourseSets({ courseId: currCourse.id, userId: currUser.id }));
      setIsLoaded(true);
    }
  }, [currCourse, courseId, dispatch]);

    // useEffect(() => {
    //     if (currUser && currUser.id !== null && courseId) {
    //         dispatch(getUserCourses(currUser.id));
    //     }
    // }, [currUser, courseId, dispatch]);

    // useEffect(() => {
    //     if (currUser && courseId && status !== 'succeeded') {
    //         const userId = currUser.id;
    //         dispatch(getCourseSets({ courseId, userId }));
    //     }

    //     setIsLoaded(true);
    // }, [currUser, courseId, status, dispatch]);

    // useEffect(() => {
    //   if (currUser && courses) {
    //     const course = courses.find((course) => course.id === courseId);
    //     setCurrCourse(course);
    //     console.log('course:', course);
    //   }
    // }, [currUser, courses, setIsLoaded, setCurrCourse, flashcardSets]);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleDeleteClick = (flashcardSetId) => {
    setSelectedFlashcardSetId(flashcardSetId);
    openModal(
      <DeleteConfirmation
        onConfirm={() => handleDelete(flashcardSetId)}
        onClose={closeModal}
      />
    );
  };

  const handleDelete = async (flashcardSetId) => {
    const userId = currUser.id;
    const flashcardSetData = {
      setId: flashcardSetId,
      userId,
    };
    console.log("deleting:", flashcardSetData);

    dispatch(removeFlashcardSet(flashcardSetData))
      .unwrap()
      .then(() => {
        console.log("Course deleted successfully");
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to delete course:", error);
      });
  };

  const handleEditClick = (course) => {
    console.log("in function handleEditClick");
    setEditingFlashcardSetId(course.id);
    setEditedTitle(course.title);
  };

  const handleTitleChange = (e) => {
    console.log("in function handleTitleChange");
    setEditedTitle(e.target.value);
  };

  const handleTitleSubmit = (flashcardSetId) => {
    console.log("in function handleTitleSubmit");
    dispatch(
      updateFlashcardSet({
        id: flashcardSetId,
        title: editedTitle,
        userId: currUser.id,
      })
    )
      .unwrap()
      .then(() => {
        setEditingFlashcardSetId(null);
      })
      .catch((error) => {
        console.error("Failed to update course:", error);
      });
  };

  const handleTitleBlur = (courseId, originalTitle) => {
    console.log("in function handleTitleBlur");
    if (editedTitle !== originalTitle) {
      handleTitleSubmit(courseId);
    } else {
      setEditingFlashcardSetId(null);
    }
  };

  return (
    <MainLayout>
      {isLoaded ? (
        <>
          <div className="flex justify-between items-center mb-6">
            {/* <h1 className="text-xl font-medium text-dark-gray py-2">{ currCourse?.title } {flashcardSets}</h1> */}
            <button
              onClick={() =>
                openModal(
                  <AddCourseForm
                    onClose={closeModal}
                    userId={currUser.id}
                    type="Set"
                    courseId={currCourse?.id}
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
              Set
            </button>
          </div>
          <div className="w-full">
            <div className="flex flex-col w-full items-center justify-between py-4">
              {flashcardSets && flashcardSets.length > 0 ? (
                flashcardSets.map((set) => (
                  <div
                    key={set.id}
                    className="w-full flex p-6 border-b hover:bg-accent-pink/10"
                  >
                    {/* all flashcard set details */}
                    <Link
                      href={`/course/${courseId}/set/${set.id}`}
                      className="flex w-full items-center space-x-4 grow"
                    >
                      {/* flashcard set status */}
                      <div className="text-gray-500 pr-2">
                        {/* to-do: change color of check mark if user completed all flashcards */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>

                      {/* individual course details */}
                      <div className="flex flex-col w-full">
                        <div className="flex flex-col grow">
                          {editingFlashcardSetId === set.id ? (
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={handleTitleChange}
                              onBlur={() => handleTitleBlur(set.id, set.title)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (editedTitle !== set.title) {
                                    handleTitleSubmit(set.id);
                                  } else {
                                    setEditingFlashcardSetId(null);
                                  }
                                }
                              }}
                              className="text-lg w-3/4 font-semibold text-dark-gray bg-light-gray p-1 rounded focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple"
                              autoFocus
                            />
                          ) : (
                            <span className="text-lg font-semibold text-dark-gray">
                              {set.title}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            # of flashcards studied of total flashcards
                          </span>

                          {/* progress */}
                          <div className="w-3/4 bg-gray-200 rounded-full h-2.5 mt-3">
                            <div
                              className="h-2.5 rounded-full"
                              // style={{
                              //   width: `${(course.cardsStudied / course.totalCards) * 100}%`,
                              //   backgroundColor: course.progressColor,
                              // }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* action buttons */}
                    <div className="flex space-x-4">
                      {/* edit */}
                      <button
                        className="text-gray-500 hover:text-primary-purple"
                        onClick={() => handleEditClick(set)}
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

                      {/* delete */}
                      <button
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(set.id)}
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
                  You have no flashcard sets. Click the &apos;+ Set&apos; button
                  on the top right to add a flashcard set!
                </p>
              )}
            </div>
          </div>

          {/* modal */}
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {modalContent}
          </Modal>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </MainLayout>
  );
}
