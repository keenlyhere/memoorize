export default function StudyCard({ question, answer, onFlip, flipped }) {
  return (
    <div
      className={`relative w-full max-w-4xl lg:min-h-[33rem] lg:h-4/6 h-3/5 p-6 bg-white border border-gray-300 rounded-lg cursor-pointer hover:shadow-md`}
      onClick={onFlip}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`absolute inset-0 flex grow items-center justify-center bg-white rounded-lg bg-opacity-75 p-4 overflow-auto`}
      >
        <p className="text-lg font-semibold text-dark-gray">
          {flipped ? answer : question}
        </p>
      </div>
    </div>
  )
}
