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
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2400); // 5 phút
  const [showAlert, setShowAlert] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quizId'); // Lấy quizId từ URL query
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/question/quiz/${quizId}`);
        setQuestionsData(response.data.data); // Lưu dữ liệu câu hỏi từ API
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

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

  const handleSubmitResult = async () => {
    try {
      // Tính số câu đúng và điểm
      const correctCount = questionsData.reduce((count, question) => {
        const userAnswer = answers[question.id];
        if (question.type === 1 || question.type === 2) {
          const isCorrect = question.answers.every((answer) => {
            return (
              (answer.isCorrect && userAnswer?.includes(answer.id)) ||
              (!answer.isCorrect && !userAnswer?.includes(answer.id))
            );
          });
          return isCorrect ? count + 1 : count;
        } else if (question.type === 3) {
          const isCorrect = question.answers[0]?.content.toLowerCase() === userAnswer?.toLowerCase();
          return isCorrect ? count + 1 : count;
        }
        return count;
      }, 0);

      const score = Math.round(correctCount * 0.5);
      const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

      // Payload gửi đến API
      const payload = {
        userId,
        quizId,
        score,
        correctCount,
      };

      // Gửi dữ liệu đến API
      await axios.post('http://localhost:8080/api/v1/result/add', payload);
      alert('Bài làm đã được nộp thành công!');
      router.push('/kiemtra'); // Điều hướng về trang /kiemtra
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại.');
    }
  };

  const renderQuestion = (question) => {
    if (question.type === 1) {
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

    if (question.type === 2) {
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

    if (question.type === 3) {
      return (
        <TextField
          variant="outlined"
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          placeholder="Nhập câu trả lời"
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
        {questionsData.length > 0 ? (
          <>
            <Typography variant="h5" sx={{ color: 'black' }}>
              {questionsData[currentQuestion].content}
            </Typography>
            {questionsData[currentQuestion].image && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={questionsData[currentQuestion].image}
                  alt="Question"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '250px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
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
          </>
        ) : (
          <Typography variant="h6" sx={{ color: 'black' }}>
            Đang tải câu hỏi...
          </Typography>
        )}
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
              sx={{
                border: currentQuestion === index ? '2px solid gold' : '1px solid #ccc',
                fontWeight: currentQuestion === index ? 'bold' : 'normal',
              }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
        <Typography mt={4} sx={{ textAlign: 'center', color: 'black', fontSize: '18px' }}>
          Thời gian còn lại: {formatTime()}
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Nộp bài
        </Button>
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
          <Button
            onClick={async () => {
              await handleSubmitResult();
              setDialogOpen(false);
            }}
            color="secondary"
            variant="contained"
          >
            Xác nhận nộp
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quiz;
