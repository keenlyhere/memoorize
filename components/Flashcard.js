export default function Flashcard({ question, answer }) {
  const handleEditClick = () => {
    return;
  }

  const handleDeleteClick = () => {
    return;
  }
  return (
    <div
      className="bg-white rounded-lg shadow-sm lg:flex-row flex flex-col divide-x divide-gray-200 border border-gray-300 mb-6 relative w-full min-h-64">
      <div className="absolute lg:w-fit lg:self-end lg:left-4 top-4 lg:bottom-4 right-4 flex space-x-2">
        <button
          className="text-gray-500 hover:text-primary-purple"
          onClick={handleEditClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
          </svg>
        </button>
        <button
          className="text-gray-500 hover:text-red-600"
          onClick={handleDeleteClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-6 pt-6">
        <h2 className="lg:text-lg lg:font-medium lg:text-dark-gray hidden">Q</h2>
        <p className="mt-2 text-xl text-dark-gray">
          { question }
        </p>
      </div>
      <div className="flex-1 px-6 pb-6 lg:p-6">
        <h2 className="lg:text-lg lg:font-medium lg:text-gray-400 hidden">A</h2>
        <p className="lg:mt-0 mt-6 text-xl text-dark-gray">
          { answer }
        </p>
      </div>
    </div>
  )
}
