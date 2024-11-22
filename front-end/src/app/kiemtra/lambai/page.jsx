'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Radio,
  Checkbox,
  TextField,
  Typography,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút
  const [showAlert, setShowAlert] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleAutoSubmit = () => {
    alert('Hết giờ, bài làm sẽ được nộp!');
    handleSubmit();
  };

  const handleSubmit = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const renderQuestion = (question) => {
    if (question.type === 'SINGLE_CHOICE') {
      return question.answers.map((answer) => (
        <label key={answer.id} className="flex items-center space-x-2">
          <Radio
            checked={answers[question.id] === answer.id}
            onChange={() => handleAnswerChange(question.id, answer.id)}
          />
          <Typography sx={{ color: 'black' }}>{answer.content}</Typography>
        </label>
      ));
    }

    if (question.type === 'MULTIPLE_CHOICE') {
      return question.answers.map((answer) => (
        <label key={answer.id} className="flex items-center space-x-2">
          <Checkbox
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
          <Typography sx={{ color: 'black' }}>{answer.content}</Typography>
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
          fullWidth
          sx={{ input: { color: 'black' } }}
        />
      );
    }

    return null;
  };

  return (
    <Box display="flex" height="100vh" padding={4} bgcolor="#f5f5f5">
      {/* Main Content */}
      <Box flex={2} display="flex" flexDirection="column" justifyContent="space-between" padding={3} bgcolor="#ffffff" borderRadius={2}>
        <Typography variant="h5" sx={{ color: 'black' }}>
          {questionsData[currentQuestion].content}
        </Typography>
        <Box mt={2}>{renderQuestion(questionsData[currentQuestion])}</Box>
        {showAlert && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn còn câu chưa trả lời.
          </Alert>
        )}
        <Box display="flex" justifyContent="space-between" mt={3}>
          {currentQuestion > 0 && (
            <Button variant="contained" color="primary" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
              Quay lại
            </Button>
          )}
          {currentQuestion < questionsData.length - 1 ? (
            <Button variant="contained" color="primary" onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Tiếp theo
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              Nộp bài
            </Button>
          )}
        </Box>
      </Box>

      {/* Navigation Panel */}
      <Box flex={1} padding={3} ml={4} bgcolor="#ffffff" borderRadius={2}>
        <Typography variant="h6" sx={{ color: 'black' }} gutterBottom>
          Danh sách câu hỏi
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
          {questionsData.map((q, index) => (
            <Button
              key={q.id}
              variant="contained"
              onClick={() => setCurrentQuestion(index)}
              color={answers[q.id] ? 'success' : 'inherit'}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
        <Typography mt={4} sx={{ textAlign: 'center', color: 'black', fontSize: '18px' }}>
          Thời gian còn lại: {formatTime()}
        </Typography>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Trạng thái câu hỏi</DialogTitle>
        <DialogContent>
          {questionsData.map((q, index) => (
            <Typography
              key={q.id}
              sx={{ color: answers[q.id] ? 'black' : 'red', marginBottom: '8px' }}
            >
              Câu {index + 1}: {answers[q.id] ? 'Đã ghi nhận câu trả lời' : 'Chưa có câu trả lời'}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Đóng
          </Button>
          <Button onClick={() => alert('Bài làm đã được nộp!')} color="secondary" variant="contained">
            Xác nhận nộp
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quiz;
