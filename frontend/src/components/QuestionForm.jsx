import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function QuestionForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await axios.post('http://localhost:5000/questions', {
        title,
        body,
        tags: tagArray
      });
      navigate('/');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3">
      <h2 className="text-2xl font-bold text-sky-700 mb-3">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-sky-200 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="What's your question?"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="6"
            className="w-full p-2 border border-sky-200 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Describe your question in detail..."
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-sky-200 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter tags separated by commas"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition-colors"
        >
          Post Question
        </button>
      </form>
    </div>
  );
}

export default QuestionForm;