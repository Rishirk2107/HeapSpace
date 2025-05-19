import { useState } from 'react';
import axios from 'axios';

function AnswerForm({ questionId, onAnswerSubmitted }) {
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/questions/${questionId}/answers`, { body });
      setBody('');
      onAnswerSubmitted();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
      <h3 className="text-lg font-medium text-sky-700 mb-2">Your Answer</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="4"
            className="w-full p-2 border border-sky-200 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Write your answer here..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => onAnswerSubmitted()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
          >
            Post Answer
          </button>
        </div>
      </form>
    </div>
  );
}

export default AnswerForm;