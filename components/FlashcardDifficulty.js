export default function FlashcardDifficulty({ onDifficultySelect }) {
  return (
    <>
        <p className="text-dark-gray">How difficult did you find this?</p>
        <div className="flex justify-center space-x-4 mt-4">
        {["easy", "medium", "hard"].map((level) => (
            <button
            key={level}
            onClick={() => onDifficultySelect(level)}
            className="px-4 py-2 bg-primary-purple text-white rounded-lg"
            >
            {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
        ))}
        </div>
    </>
  )
}
