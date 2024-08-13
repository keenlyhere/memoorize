'use client'
import { useAppDispatch } from "@/lib/hooks";
import Sidebar from "./Sidebar";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { clearUser, setUser } from "@/lib/features/users/userSlice";

export default function MainLayout({ children }) {
	const dispatch = useAppDispatch();
	const { user, isLoaded, isSignedIn } = useUser();

	useEffect(() => {
		if (isLoaded) {
			if (isSignedIn && user) {
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
			} else {
				// clear user information in Redux store if not signed in
				dispatch(clearUser());
			}
		}
	}, [isLoaded, isSignedIn, user, dispatch]);

	return (
		<>
			<Sidebar />
			<main className="bg-light-gray lg:pl-72 lg:py-6 lg:pr-6 h-screen p-6 overflow-auto">{children}</main>
		</>
	);
}
