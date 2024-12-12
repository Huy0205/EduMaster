'use client';
import React, { useState, useEffect,Suspense } from 'react';
import {
  Button,
  Radio,
  Checkbox,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getApiNoneToken, postApiNoneToken } from '~/api/page';
import HomeIcon from '@mui/icons-material/Home';
import FlagIcon from '@mui/icons-material/Flag';
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(); // 5 phút
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false); // Biến để xác nhận thoát
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quizId');
  const router = useRouter();
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getApiNoneToken(`/quiz/${quizId}`);
        setTimeLeft((response.data.data.time)*60); 
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getApiNoneToken(`question/quiz/${quizId}`);
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
    handleSubmitResult();
  };

  const handleSubmit = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmitResult = async () => {
    try {
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

      const score = correctCount * 0.5;
      const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

      const payload = {
        userId,
        quizId,
        score,
        correctCount,
      };

      console.log('Payload gửi đi:', payload);
      await postApiNoneToken('result/add', payload);
      const queryParams = new URLSearchParams({
        quizId,
        timeLeft: timeLeft.toString(),
        score: score.toString(),
      }).toString();
      // Chuyển hướng sang trang kết quả với query string
      router.push(`/kiemtra/ketqua?${queryParams}`);
    } catch (error) {
      console.error('Error submitting result:', error);
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
          <Typography sx={{ color: 'black', fontSize: 32 }}>{answer.content}</Typography>
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
          <Typography sx={{ color: 'black', fontSize: 32 }}>{answer.content}</Typography>
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
          sx={{ input: { color: 'black' }, fontSize: 32 }}
        />
      );
    }

    return null;
  };

  const handleHomeClick = () => {
    setConfirmExit(true);
  };

  const handleExitConfirm = (confirm) => {
    if (confirm) {
      router.push('/kiemtra'); // Quay về trang kiểm tra nếu đồng ý thoát
    }
    setConfirmExit(false);
  };

  return (
    <Box display="flex" height="90vh" bgcolor="#f5f5f5" >
      {/* Main Content */}
      <Box flex={2} display="flex" flexDirection="column" padding={3} bgcolor="#ffffff" borderRadius={2} gap={5}>
        {/* Layout trên: Home button + Time */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ borderBottom: '2px solid #ccc' }}>
          <IconButton onClick={handleHomeClick}>
            <HomeIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="h5" sx={{ color: 'black', fontSize: 32 }}>
            Thời gian còn lại: <span style={{ color: 'red' }}>{formatTime()}</span>
          </Typography>
          <Box />
        </Box>

        {questionsData.length > 0 ? (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" padding={2}>
              <Typography variant="h5" sx={{ color: 'black', fontSize: 32, flex: 1 }}>
                Câu {currentQuestion + 1}: {questionsData[currentQuestion].content}
              </Typography>
              <IconButton
                onClick={() => toggleFlag(questionsData[currentQuestion].id)}
                sx={{ color: flaggedQuestions.includes(questionsData[currentQuestion].id) ? 'red' : 'black' }}
              >
                <FlagIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
            {questionsData[currentQuestion].image && (
              <Box display="flex" justifyContent="center">
                {questionsData[currentQuestion].image.startsWith("http") ? (
                  <img
                    src={questionsData[currentQuestion].image}
                    alt="Question"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  questionsData[currentQuestion].image.toLowerCase().startsWith("text_") && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                        fontSize: 32,
                      }}
                    >
                      {questionsData[currentQuestion].image.slice(5)}
                    </Typography>
                  )
                )}
              </Box>
            )}
            <Box>{renderQuestion(questionsData[currentQuestion])}</Box>
            <Box display="flex" justifyContent="space-between" marginTop="auto">
              {currentQuestion > 0 && (
                <Button variant="contained" color="primary" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                  Câu trước
                </Button>
              )}
              {currentQuestion < questionsData.length - 1 ? (
                <Button variant="contained" color="primary" onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Câu tiếp
                </Button>
              ) : (
                <Typography></Typography>
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
        <Typography variant="h6" sx={{ color: 'black',fontSize:32 }} gutterBottom>
          Danh sách câu hỏi
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
          {questionsData.map((q, index) => {
            const isFlagged = flaggedQuestions.includes(q.id);
            const isAnswered = !!answers[q.id];
            const isCurrent = currentQuestion === index;

            return (
              <Button
                key={q.id}
                variant="contained"
                onClick={() => setCurrentQuestion(index)}
                sx={{
                  border: isCurrent ? '2px solid gold' : '1px solid #ccc',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  backgroundColor: isFlagged
                    ? 'red'
                    : isAnswered
                      ? 'green'
                      : 'inherit',
                  color: isFlagged ? 'white' : 'inherit',
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            sx={{ flex: 1 }}
          >
            Nộp bài
          </Button>
        </Box>
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

      {/* Xác nhận thoát */}
      {confirmExit && (
        <Dialog open={confirmExit} onClose={() => setConfirmExit(false)}>
          <DialogTitle>Xác nhận</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn thoát bài kiểm tra?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleExitConfirm(false)}>Hủy</Button>
            <Button onClick={() => handleExitConfirm(true)} color="secondary">
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Quiz />
    </Suspense>
  );
}
