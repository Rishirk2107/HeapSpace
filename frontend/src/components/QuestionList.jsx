import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/questions?search=${search}`);
        setQuestions(res.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };
    fetchQuestions();
  }, [search]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Questions</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search questions..."
        className="w-full p-2 border rounded mb-4"
      />
      <Link to="/ask" className="inline-block p-2 bg-blue-500 text-white rounded mb-4">
        Ask Question
      </Link>
      {questions.map((question) => (
        <div key={question.id} className="border p-4 mb-4 rounded">
          <h3 className="text-xl">
            <Link to={`/questions/${question.id}`} className="hover:text-blue-500 transition-colors">
              {question.title}
            </Link>
          </h3>
          <p className="text-gray-600">{question.body.slice(0, 200)}...</p>
          <p className="text-sm">Asked by {question.user_name} on {new Date(question.created_at).toLocaleDateString()}</p>
          <p className="text-sm">Tags: {question.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;