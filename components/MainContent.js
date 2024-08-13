export default function MainContent({ children }) {
  return (
    <div className="bg-light-gray lg:pl-72 lg:py-6 lg:pr-6 h-screen p-6 overflow-auto">
        { children }
    </div>
  )
}