export default function DeleteConfirmation({ onConfirm, onClose }) {
  return (
    <>
        <h2 className="text-lg font-semibold mb-4 dark:text-dark-gray">Confirm Deletion</h2>
        <p className="mb-6 dark:text-dark-gray">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
            <button
                onClick={onClose}
                className="bg-gray-300 text-dark-gray py-2 px-4 rounded-lg"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
            >
                Delete
            </button>
        </div>
    </>
  )
}
