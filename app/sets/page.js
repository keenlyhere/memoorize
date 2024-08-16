'use client'
import { useUser } from "@clerk/nextjs";

import MainLayout from "@/components/MainLayout";
import { useState } from "react";

export default function Courses() {
    const { isLoaded } = useUser();
  return (
    <MainLayout>
      { isLoaded ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-dark-gray py-2">Sets</h1>
            <a href="#" className="bg-primary-purple text-white py-2 px-4 rounded-lg flex gap-2 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Set
            </a>
          </div>
          <div className="w-full">
            <div
              className="flex items-center justify-between border-b py-4"
            >
              {/* all set details */}
              <div className="flex items-center space-x-4 grow">

                {/* to-do: map out all the sets */}

                {/* set status */}
                <div className="text-gray-500">
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
                    <span className="text-lg font-semibold text-dark-gray">
                      Set Title
                    </span>
                    <span className="text-sm text-gray-500">
                      # of cards studied of total cards
                    </span>

                    {/* progress */}
                    <div className="w-3/4 bg-gray-200 rounded-full h-2.5 mt-3">
                      <div
                        className="h-2.5 rounded-full"
                        // style={{
                        //   width: ${(course.cardsStudied / course.totalCards) * 100}%,
                        //   backgroundColor: course.progressColor,
                        // }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* action buttons */}
              <div className="flex space-x-4">
                {/* edit */}
                <button className="text-gray-500 hover:text-primary-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                  </svg>
                </button>

                {/* delete */}
                <button className="text-gray-500 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </MainLayout>
  )
}
