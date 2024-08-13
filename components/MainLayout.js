import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <>
        <Sidebar />
        <div className="bg-light-gray lg:pl-72 lg:py-6 lg:pr-6 h-screen p-6">
            { children }
        </div>
    </>
  )
}
