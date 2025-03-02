export const ConfirmBox = ({question, answers, red=true, handleYes, handleNo}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          {question}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleYes}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {answers[0]}
          </button>
          <button
            onClick={handleNo}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {answers[1]}
          </button>
        </div>
      </div>
    </div>
  )
}
