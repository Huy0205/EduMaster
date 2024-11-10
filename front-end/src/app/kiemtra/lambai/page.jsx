'use client'
import React, { useState, useEffect } from 'react';
import { Button, Radio, Checkbox, TextField, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

const questionsData = [
  {
    id: 'q5',
    content: 'Việt Nam nằm ở đâu?',
    type: 'SINGLE_CHOICE',
    order: 1,
    answers: [
      { id: 'a1', content: 'Đông Nam Á', isCorrect: true, feedback: 'Đúng' },
      { id: 'a2', content: 'Tây Á', isCorrect: false, feedback: 'Sai' },
    ],
  },
  {
    id: 'q6',
    content: 'Kết quả nào tổng bằng 4',
    type: 'MULTIPLE_CHOICE',
    order: 2,
    answers: [
      { id: 'a3', content: '1+3', isCorrect: true, feedback: 'Đúng' },
      { id: 'a4', content: '2+2', isCorrect: true, feedback: 'Sai' },
      { id: 'a5', content: '1+2', isCorrect: false, feedback: 'Sai' },
      { id: 'a6', content: '2-2', isCorrect: false, feedback: 'Sai' },
    ],
  },
  {
    id: 'q7',
    content: '3+3 bằng bao nhiêu?',
    type: 'FILL_IN_THE_BLANK',
    order: 3,
    answers: [{ id: 'a7', content: '6', isCorrect: true, feedback: 'Đúng' }],
  },
];

const Quiz = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes in seconds
  const [incompleteQuestions, setIncompleteQuestions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const incomplete = questionsData.filter((q) => {
      if (q.type === 'SINGLE_CHOICE') return !answers[q.id];
      if (q.type === 'MULTIPLE_CHOICE') return !answers[q.id] || answers[q.id].length === 0;
      if (q.type === 'FILL_IN_THE_BLANK') return !answers[q.id];
      return false;
    }).map(q => q.order);

    if (incomplete.length > 0) {
      setIncompleteQuestions(incomplete);
      setShowAlert(true);
    } else {
      alert("All questions answered. Submitting your answers...");
      router.push('/results'); // Navigate to results page or handle submission
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderQuestion = (question) => {
    if (question.type === 'SINGLE_CHOICE') {
      return question.answers.map((answer) => (
        <label key={answer.id} className="flex items-center space-x-2">
          <Radio
            color="primary"
            checked={answers[question.id] === answer.id}
            onChange={() => handleAnswerChange(question.id, answer.id)}
          />
          <Typography>{answer.content}</Typography>
        </label>
      ));
    }

    if (question.type === 'MULTIPLE_CHOICE') {
      return question.answers.map((answer) => (
        <label key={answer.id} className="flex items-center space-x-2">
          <Checkbox
            color="primary"
            checked={answers[question.id]?.includes(answer.id)}
            onChange={(e) => {
              const updatedAnswers = answers[question.id] || [];
              handleAnswerChange(
                question.id,
                e.target.checked
                  ? [...updatedAnswers, answer.id]
                  : updatedAnswers.filter((a) => a !== answer.id)
              );
            }}
          />
          <Typography>{answer.content}</Typography>
        </label>
      ));
    }

    if (question.type === 'FILL_IN_THE_BLANK') {
      return (
        <TextField
          variant="outlined"
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          placeholder="Type your answer"
          className="w-full"
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col md:flex-row p-6 space-y-4 md:space-y-0 md:space-x-8">
      <div className="w-full md:w-1/4 space-y-2">
        <Typography variant="h6">Quiz Navigation</Typography>
        <div className="grid grid-cols-5 gap-2">
          {questionsData.map((q, index) => (
            <Button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`${
                answers[q.id] ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              variant="contained"
              size="small"
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Typography className="text-red-500 mt-4 text-center">
          Time left: {formatTime()}
        </Typography>
        <div className="mt-4">
          <Typography variant="h6">Question Status</Typography>
          {questionsData.map((q, index) => (
            <Typography key={q.id} className="text-sm">
              Question {index + 1}: {answers[q.id] ? 'Answered' : 'Not Answered'}
            </Typography>
          ))}
        </div>
      </div>

      <div className="w-full md:w-3/4 space-y-4">
        <Typography variant="h5">{questionsData[currentQuestion].content}</Typography>
        {renderQuestion(questionsData[currentQuestion])}

        {showAlert && (
          <Alert severity="warning" className="mt-4">
            You have unanswered questions: {incompleteQuestions.join(', ')}
          </Alert>
        )}

        <div className="flex justify-between mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={currentQuestion === questionsData.length - 1}
          >
            Next Question
          </Button>
          {currentQuestion === questionsData.length - 1 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
