'use client'
import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiNoneToken } from '~/api/page';
import Question from '~/components/thuchanh/question';

export default function Home() {
  const searchParams = useSearchParams();
  const pargesId = searchParams.get('pargesId');
  const userId = searchParams.get('userId');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const router = useRouter();

  const chapterName = "Chương 1";
  const lessonName = "Bài 1: Vị Trí";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getApiNoneToken(`question/practice/${pargesId}`);
        setQuestionsData(response.data.data); // Lấy dữ liệu từ API
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (pargesId) {
      fetchQuestions();
    }
  }, [pargesId]);
  useEffect(() => {
    const fetchLastQuestionIndex = async () => {
      try {
        const response = await getApiNoneToken(`practice-progress/user/${userId}/practice/${pargesId}`);
        let lastIndex = response.data.data.lastQuestionIndex || 0; // Nếu không có lastQuestionIndex, mặc định là 0

        // Nếu lastIndex bằng questionsData.length, chuyển về 0 (câu hỏi đầu tiên)
        if (lastIndex >= questionsData.length) {
          lastIndex = 0;
        }

        setCurrentQuestion(lastIndex);
      } catch (error) {
        console.error('Error fetching lastQuestionIndex:', error);
      }
    };

    if (userId && pargesId) {
      fetchLastQuestionIndex();
    }
  }, [userId, pargesId, questionsData.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentQuestion >= questionsData.length && timeTaken === null) {
      setTimeTaken(elapsedTime);
    }
  }, [currentQuestion, elapsedTime, questionsData.length, timeTaken]);

  const handleAnswerSubmission = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }
  };

  const handleFinish = async () => {
    router.push("/ontap");
    let pointsToAdd = 10;
    if (score < questionsData.length / 2) {
      // Sai quá 50% => không được cộng điểm
      return;
    } else if (score === questionsData.length) {
      // Đúng 100% => x2 điểm
      pointsToAdd = pointsToAdd * 2; // Giả định: mỗi bài ôn tập bình thường cộng 10 điểm
    }
    try {
      // Gửi API cập nhật điểm
      const res = await getApiNoneToken(`user/${userId}`);
      const currentPoints = res.data.data.points || 0; // Lấy điểm hiện tại từ API
      const updatedPoints = currentPoints + pointsToAdd;

      await putApiNoneToken(`user/update/${userId}`, {
        totalPoint: updatedPoints, // Cộng điểm vào điểm hiện tại
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật điểm:', error);
    }
  };

  if (currentQuestion >= questionsData.length) {
    return (
      <Box className="min-h-screen flex flex-col items-center" sx={{
        backgroundImage: 'url(/img/bg-question.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <Header />
        <Navbar />
        <Box
          className="p-6 text-center"
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 3,
            maxWidth: 1000,
            margin: '8px',
            padding: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }} className='text-black'>
            Hoàn thành bài ôn tập
          </Typography>
          <Box mt={2}>
            <Typography variant="body1" color="textSecondary" mt={1}>
              Số câu đúng: {score} / {questionsData.length}
            </Typography>
            <Typography variant="body1" color="textSecondary" mt={1}>
              Số câu sai: {incorrectAnswers} / {questionsData.length}
            </Typography>
          </Box>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: '100%', py: 1 }}
              onClick={handleFinish}
            >
              Xong
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex flex-col items-center" sx={{
      backgroundImage: 'url(/img/bg-question.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Header />
      <Navbar />
      <Box sx={{ maxWidth: 800 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#000" }}>
          {chapterName} {'>'} {lessonName}
        </Typography>
      </Box>
      <Box className="text-lg font-bold my-4 flex items-center justify-center gap-28 space-x-6 bg-white p-4 rounded-lg shadow-lg " sx={{
        minWidth: 1200,
      }}>
        <Box className="flex items-center space-x-2">
          <Image src="/img/star.svg" alt="Lesson Icon" width={24} height={24} />
          <span className="font-bold text-lg text-black">{currentQuestion + 1}/{questionsData.length}</span>
        </Box>
        <Box className="flex items-center space-x-2 border rounded-lg p-2">
          <Image src="/img/clock.svg" alt="Clock Icon" width={24} height={24} />
          <span className="font-bold text-lg text-black">
            {String(Math.floor(elapsedTime / 3600)).padStart(2, '0')} : {String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0')} : {String(elapsedTime % 60).padStart(2, '0')}
          </span>
        </Box>
        <Box className="flex items-center space-x-1">
          <Image src="/img/correctPractice.png" alt="Correct Icon" width={24} height={24} />
          <span className="text-green-600 font-bold text-lg">{score}</span>
        </Box>
        <Box className="flex items-center space-x-1">
          <Image src="/img/wrongPractice.png" alt="Incorrect Icon" width={24} height={24} />
          <span className="text-red-600 font-bold text-lg">{incorrectAnswers}</span>
        </Box>
      </Box>
      <Box className="flex flex-col items-center justify-center mt-8 p-4 " sx={{ maxWidth: 1000, width: '100%', height: 500 }}>
        {questionsData.length > 0 ? (
          <Question
            question={questionsData[currentQuestion]}
            questionlist={currentQuestion}
            onNext={handleNextQuestion}
            onSubmitAnswer={handleAnswerSubmission}
            userId={userId}
            pargesId={pargesId}
          />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Box>
  );
}


