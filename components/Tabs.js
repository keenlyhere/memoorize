export default function Tabs({ activeTab, onChange }) {
  return (
    <div className="w-full flex justify-center mb-6 bg-white">
      <button
        className={`h-full w-1/2 px-6 py-4 focus:outline-none ${
          activeTab === "all"
            ? "bg-muted-pink text-white"
            : "bg-white text-dark-gray"
        }`}
        onClick={() => onChange("all")}
      >
        All
      </button>
      <button
        className={`h-full w-1/2 px-6 py-4 focus:outline-none ${
          activeTab === "study"
            ? "bg-muted-pink text-white"
            : "bg-white text-dark-gray"
        }`}
        onClick={() => onChange("study")}
      >
        Study Mode
      </button>
    </div>
  )
}
