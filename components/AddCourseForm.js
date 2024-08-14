'use client'
import { addCourse } from "@/lib/features/courses/coursesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export default function AddCourseForm({ onClose, userId }) {
    const { status, error } = useAppSelector((state) => state.courses);
    const [courseTitle, setCourseTitle] = useState('');
    const [ errors, setErrors ] = useState(null);
    const dispatch = useAppDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!courseTitle) {
            setErrors('Course title is required');
            return;
        }

        const newCourse = {
            title: courseTitle,
            userId
        }

        dispatch(addCourse(newCourse))
            .unwrap()
            .then(() => {
                setCourseTitle('');
                onClose();
            })
            .catch((err) => {
                console.error('Failed to add course:', err);
            })
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-dark-gray">Add New Course</h2>
            <div className="relative mb-4">
                <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                    className="peer w-full p-3 h-12 border border-gray-300 rounded-md outline-none focus:border-primary-purple focus:ring-0 focus:outline-none transition-all bg-white text-dark-gray placeholder-transparent"
                    placeholder="Course Name"
                    id="courseTitle"
                />
                <label
                    htmlFor="courseTitle"
                    className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary-purple peer-focus:bg-white"
                >
                    Course Name
                </label>
            </div>

            { status === 'failed' && <p className="text-red-500 text-sm mb-4">{error}</p> }
            { errors && errors.length && <p className="text-red-500 text-sm mb-4">{errors}</p> }

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 text-dark-gray py-2 px-4 rounded-lg"
                    disabled={ status === 'loading' }
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-primary-purple text-white py-2 px-4 rounded-lg w-36"
                >
                    { status === 'loading' ? (
                        <div className="flex content-between gap-2 justify-center items-center">
                            <svg aria-hidden="true" className="w-5 h-5 font-bold text-light-gray animate-spin dark:text-light-gray/50 fill-light-gray" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            Adding...
                        </div>
                    ) : 'Add Course' }
                </button>
            </div>
        </form>
    )
}
