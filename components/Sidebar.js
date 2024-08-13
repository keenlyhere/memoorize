'use client'

import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs";

export default function Sidebar() {
    const currentPage = usePathname();
    const { user } = useUser();
  return (
        <div className="lg:w-64 lg:h-screen lg:fixed lg:top-0 lg:left-0 lg:flex lg:flex-col lg:shadow-lg lg:space-y-4 lg:px-4 lg:py-6 lg:block lg:overflow-y-auto lg:border-0 fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-gray-200 dark:bg-dark-gray dark:border-gray-600">
            {/* logo */}
            <h1 className="lg:block text-3xl font-bold hidden text-center">me<span className="bg-gradient-to-l text-transparent bg-clip-text inline-block">moo</span>rize</h1>
            {/* main sidebar links */}
            <div className="lg:flex-col lg:justify-start lg:items-start lg:pt-5 h-full w-full font-medium flex justify-center items-center lg:gap-y-1.5">
                <a href="/dashboard" className={`lg:block lg:flex lg:h-max lg:py-2 lg:px-4 lg:rounded-lg lg:w-full lg:hover:bg-gradient-to-r lg:hover:opacity-75 lg:flex lg:flex-row lg:items-center lg:justify-start lg:hover:text-white inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 h-full dark:hover:bg-accent-pink/25 dark:hover:opacity-100 dark:hover:text-white text-gray-500 group ${ currentPage === '/dashboard' ? 'active lg:[&.active]:bg-gradient-to-r lg:[&.active]:opacity-75 lg:dark:[&.active]:opacity-100' : '' }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`lg:me-2.5 text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray lg:group-hover:text-light-gray group-hover:text-primary-purple dark:group-hover:text-white size-6 ${ currentPage === '/dashboard' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>
                        <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray group-hover:text-light-gray dark:group-hover:text-light-gray group-hover:text-primary-purple ${ currentPage === '/dashboard' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>Dashboard</span>
                </a>
                <a href="/courses" className={`lg:block lg:flex lg:h-max lg:py-2 lg:px-4 lg:rounded-lg lg:w-full lg:hover:bg-gradient-to-r lg:hover:opacity-75 lg:flex lg:flex-row lg:items-center lg:justify-start lg:hover:text-white inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 h-full dark:hover:bg-accent-pink/25 dark:hover:opacity-100 dark:hover:text-white text-gray-500 group ${ currentPage === '/courses' ? 'active lg:[&.active]:bg-gradient-to-r lg:[&.active]:opacity-75 lg:dark:[&.active]:opacity-100' : '' }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`lg:me-2.5 text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray lg:group-hover:text-light-gray group-hover:text-primary-purple dark:group-hover:text-white size-6 ${ currentPage === '/courses' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>
                        <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                        <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                        <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                    </svg>
                    <span className={`text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray group-hover:text-light-gray dark:group-hover:text-light-gray group-hover:text-primary-purple ${ currentPage === '/courses' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>Courses</span>
                </a>
                <a href="/recall" className={`lg:block lg:flex lg:h-max lg:py-2 lg:px-4 lg:rounded-lg lg:w-full lg:hover:bg-gradient-to-r lg:hover:opacity-75 lg:flex lg:flex-row lg:items-center lg:justify-start lg:hover:text-white inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 h-full dark:hover:bg-accent-pink/25 dark:hover:opacity-100 dark:hover:text-white text-gray-500 group ${ currentPage === '/recall' ? 'active lg:[&.active]:bg-gradient-to-r lg:[&.active]:opacity-75 lg:dark:[&.active]:opacity-100' : '' }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`lg:me-2.5 text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray lg:group-hover:text-light-gray group-hover:text-primary-purple dark:group-hover:text-white size-6 ${ currentPage === '/recall' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray group-hover:text-light-gray dark:group-hover:text-light-gray group-hover:text-primary-purple ${ currentPage === '/recall' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>Recall</span>
                </a>
                <a href="/settings" className={`lg:block lg:flex lg:h-max lg:py-2 lg:px-4 lg:rounded-lg lg:w-full lg:hover:bg-gradient-to-r lg:hover:opacity-75 lg:flex lg:flex-row lg:items-center lg:justify-start lg:hover:text-white inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 h-full dark:hover:bg-accent-pink/25 dark:hover:opacity-100 dark:hover:text-white text-gray-500 group ${ currentPage === '/settings' ? 'active lg:[&.active]:bg-gradient-to-r lg:[&.active]:opacity-75 lg:dark:[&.active]:opacity-100' : '' }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`lg:me-2.5 text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray lg:group-hover:text-light-gray group-hover:text-primary-purple dark:group-hover:text-white size-6 ${ currentPage === '/settings' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>
                        <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                    </svg>
                    <span className={`text-sm text-gray-500 lg:group-hover:text-light-gray dark:text-light-gray group-hover:text-light-gray dark:group-hover:text-light-gray group-hover:text-primary-purple ${ currentPage === '/settings' ? 'active lg:[&.active]:text-white [&.active]:text-primary-purple' : '' }`}>Settings</span>
                </a>
            </div>
            {/* user info */}
            <div className="lg:flex w-full items-center gap-4 hidden">
                { user ? (
                    <img src={user?.imageUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                )}
                <p>{ user?.fullName }</p>
            </div>
        </div>
  )
}
