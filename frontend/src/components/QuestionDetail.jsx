import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AnswerForm from './AnswerForm';

function QuestionDetail() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const [questionRes, answersRes] = await Promise.all([
          axios.get(`http://localhost:5000/questions/${id}`),
          axios.get(`http://localhost:5000/questions/${id}/answers`)
        ]);
        setQuestion(questionRes.data);
        setAnswers(answersRes.data);
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };
    fetchQuestionAndAnswers();
  }, [id]);

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-800 mb-4">{question.body}</p>
          <div className="flex items-center text-sm text-gray-600">
            <span>Asked by {question.user_name}</span>
            <span className="mx-2">•</span>
            <span>{new Date(question.created_at).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>Tags: {question.tags.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Answers ({answers.length})</h2>
        {answers.map((answer) => (
          <div key={answer.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <p className="text-gray-800 mb-4">{answer.body}</p>
            <div className="text-sm text-gray-600">
              <span>Answered by {answer.user_name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(answer.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        {!showAnswerForm ? (
          <button
            onClick={() => setShowAnswerForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Write an Answer
          </button>
        ) : (
          <AnswerForm
            questionId={id}
            onAnswerSubmitted={() => {
              setShowAnswerForm(false);
              // Refresh answers
              axios.get(`http://localhost:5000/questions/${id}/answers`)
                .then(res => setAnswers(res.data))
                .catch(error => console.error('Error refreshing answers:', error));
            }}
          />
        )}
      </div>

      <Link
        to="/"
        className="text-blue-500 hover:text-blue-600 transition-colors"
      >
        ← Back to Questions
      </Link>
    </div>
  );
}

export default QuestionDetail; 