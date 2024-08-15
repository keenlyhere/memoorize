'use client'
import MainLayout from "@/components/MainLayout";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import AddCourseForm from "@/components/AddCourseForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUserCourses, removeCourse, updateCourse } from "@/lib/features/courses/coursesSlice";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Link from "next/link";

export default function Courses() {
    const dispatch = useAppDispatch();
    const currUser = useAppSelector((state) => state.user);
    const { courses, status, error } = useAppSelector((state) => state.courses);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ modalContent, setModalContent ] = useState(null);
    const [ selectedCourseId, setSelectedCourseId ] = useState(null);
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ editingCourseId, setEditingCourseId ] = useState(null);
    const [ editedTitle, setEditedTitle ] = useState('');

    useEffect(() => {
        if (currUser && currUser.id !== null) {
            dispatch(getUserCourses(currUser.id));
        }
    }, [currUser, dispatch]);

    useEffect(() => {
      if (currUser && courses) {
        setIsLoaded(true);
        console.log('courses:', courses);
      }
    }, [currUser, courses, setIsLoaded])

    const openModal = (content) => {
      setModalContent(content);
      setIsModalOpen(true)
    };

    const closeModal = () => {
      setIsModalOpen(false)
      setModalContent(null);
    };

    const handleDeleteClick = (courseId) => {
      setSelectedCourseId(courseId);
      openModal(
        <DeleteConfirmation
          onConfirm={() => handleDelete(courseId)}
          onClose={closeModal}
        />
      )
    };

    const handleDelete = async (courseId) => {
      const userId = currUser.id;
      const courseData = {
        courseId,
        userId
      }
      console.log('deleting:', courseData)

      dispatch(removeCourse(courseData))
        .unwrap()
        .then(() => {
          console.log('Course deleted successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Failed to delete course:', error);
        });
    };

    const handleEditClick = (course) => {
      console.log('in function handleEditClick');
      setEditingCourseId(course.id);
      setEditedTitle(course.title);
    };

    const handleTitleChange = (e) => {
      console.log('in function handleTitleChange');
      setEditedTitle(e.target.value);
    };

    const handleTitleSubmit = (courseId) => {
      console.log('in function handleTitleSubmit');
      dispatch(updateCourse({ id: courseId, title: editedTitle }))
        .unwrap()
        .then(() => {
          setEditingCourseId(null);
        })
        .catch((error) => {
          console.error('Failed to update course:', error);
        })
    };

    const handleTitleBlur = (courseId, originalTitle) => {
      console.log('in function handleTitleBlur');
      if (editedTitle !== originalTitle) {
        handleTitleSubmit(courseId);
      } else {
        setEditingCourseId(null);
      }
    };

    return (
      <MainLayout>
        { isLoaded ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-medium text-dark-gray py-2">Courses</h1>
              <button
                onClick={() => openModal(
                    <AddCourseForm onClose={closeModal} userId={currUser.id} type='Course' />
                )}
                className="bg-primary-purple text-white py-2 px-4 rounded-lg flex gap-2 items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Course
              </button>
            </div>
            <div className="w-full">
              <div
                className="flex flex-col w-full items-center justify-between py-4"
              >
                { courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="w-full flex p-6 border-b hover:bg-accent-pink/10">
                      {/* all course details */}
                      <Link
                        href={`/course/${course.id}`}
                        className="flex w-full items-center space-x-4 grow"
                      >
                        <div
                          className="flex w-full items-center space-x-4 grow"
                          key={`link-${course.id}`}
                        >
                          {/* course status */}
                          <div className="text-gray-500 pr-2">
                            {/* to-do: change color of check mark if user completed all sets */}
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
                              { editingCourseId === course.id ? (
                                <input
                                  type="text"
                                  value={editedTitle}
                                  onChange={handleTitleChange}
                                  onBlur={() => handleTitleBlur(course.id, course.title)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      if (editedTitle !== course.title) {
                                        handleTitleSubmit(course.id);
                                      } else {
                                        setEditingCourseId(null);
                                      }
                                    }
                                  }}
                                  className="text-lg w-3/4 font-semibold text-dark-gray bg-light-gray p-1 rounded focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="text-lg font-semibold text-dark-gray"
                                  // onClick={() => handleEditClick(course)}
                                >
                                  { course.title }
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                # of sets studied of total sets
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
                        </div>
                      </Link>

                      {/* action buttons */}
                      <div className="flex space-x-4">
                        {/* edit */}
                        <button
                          className="text-gray-500 hover:text-primary-purple"
                          onClick={(e) => handleEditClick(course)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                          </svg>
                        </button>

                        {/* delete */}
                        <button
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(course.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (<p className="dark:text-dark-gray">You have no courses. Click the &apos;+ Course&apos; button on the top right to add a course!</p>)}
              </div>
            </div>

            {/* modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              { modalContent }
            </Modal>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </MainLayout>
    )
}
