'use client'
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Sidebar from "./Sidebar";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { clearUser, setUser } from "@/lib/features/users/userSlice";

export default function MainLayout({ children }) {
	const dispatch = useAppDispatch();
	const { user, isLoaded, isSignedIn } = useUser();
	const currUser = useAppSelector((state) => state.user);
	const [ isUserLoaded, setIsUserLoaded ] = useState(false);

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
				console.log('user:', user)
			} else {
				// clear user information in Redux store if not signed in
				dispatch(clearUser());
			}
		}
	}, [isLoaded, user, isSignedIn, dispatch]);

	useEffect(() => {
		if (currUser) {
			setIsUserLoaded(true);
		}
	}, [currUser])

	return (
		<>
			<Sidebar user={currUser} />
			<main className="bg-light-gray lg:pl-72 lg:py-6 lg:pr-6 h-screen lg:pb-0 p-6 overflow-auto pb-16">
				{ children }
			</main>
		</>
	);
}
