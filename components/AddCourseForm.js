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
                    className="bg-primary-purple text-white py-2 px-4 rounded-lg"
                >
                    { status === 'loading' ? 'Adding...' : 'Add Course' }
                </button>
            </div>
        </form>
    )
}
