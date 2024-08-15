export default function Flashcard({ question, answer, onEditClick, onDeleteClick, onSaveClick, onCancelClick, isEditing, onQuestionChange, onAnswerChange, editedQuestion, editedAnswer }) {

  return (
    <div
      className="bg-white rounded-lg shadow-sm lg:flex-row flex flex-col divide-x divide-gray-200 border border-gray-300 mb-6 relative w-full min-h-64">
      <div className="absolute lg:w-fit lg:self-end lg:left-4 top-4 lg:bottom-4 right-4 flex space-x-2">
        { isEditing ? (
          <>
            <button
              className="text-muted-purple hover:text-primary-purple"
              onClick={onSaveClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="text-red-400 hover:text-red-600"
              onClick={onCancelClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              className="text-gray-500 hover:text-primary-purple"
              onClick={onEditClick}
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
              className="text-gray-500 hover:text-red-600 pl-1"
              onClick={onDeleteClick}
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
          </>
        )}
      </div>

      <div className="flex-1 lg:p-6 px-6 pt-12">
        <h2 className="lg:text-lg lg:font-medium lg:text-dark-gray hidden">Q</h2>
        {isEditing ? (
          <textarea
            type="text"
            value={editedQuestion}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="lg:mt-0 mt-2 text-xl text-dark-gray border rounded-lg p-2 w-full h-[85%]"
          />
        ) : (
          <p className="mt-2 text-xl text-dark-gray">{question}</p>
        )}
      </div>
      <div className="flex-1 px-6 pb-6 lg:p-6">
        <h2 className="lg:text-lg lg:font-medium lg:text-gray-400 hidden">A</h2>
        {isEditing ? (
          <textarea
            value={editedAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="lg:mt-0 mt-6 text-xl text-dark-gray border rounded-lg p-2 w-full h-[85%]"
          />
        ) : (
          <p className="lg:mt-0 mt-6 text-xl text-dark-gray">{answer}</p>
        )}
      </div>
    </div>
  )
}
