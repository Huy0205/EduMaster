'use client'
import React, { useState, useEffect,Suspense } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiNoneToken,putApiNoneToken } from '~/api/page';
import Question from '~/components/thuchanh/question';
import { useOntapContext } from '~/context/OntapContext';
const Home = ()=> {
  const searchParams = useSearchParams();
  const pargesId = searchParams.get('pargesId');
  const userId = searchParams.get('userId');
  let bonusPoint = Number(searchParams.get('bonusPoint'));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const router = useRouter();
  const {
    selectedSubject,
    selectedGrade,
    topics,
    selectedTopicId,
    selectedReviewId,
  } = useOntapContext();
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
    if (score < questionsData.length / 2) {
      return;
    } else if (score === questionsData.length) {
      bonusPoint = bonusPoint * 2; 
    }
    try {
      // Gửi API cập nhật điểm
      const res = await getApiNoneToken(`user/${userId}`);
      const currentPoints = res.data.data.totalPoint || 0; 
      const updatedPoints = currentPoints + bonusPoint;
      console.log(updatedPoints);
      await putApiNoneToken(`user/update/${userId}`, {
        totalPoint: updatedPoints, 
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
    <Box
      className="min-h-screen flex flex-col items-center"
      sx={{
        backgroundImage: 'url(/img/bg-question.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <Navbar />

      {/* Box hiển thị thông tin bài học */}
      <Box sx={{ maxWidth: 800}}> {/* Thêm margin-top để tách khỏi Navbar */}
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#000" }}
        >
          {selectedSubject ? `${selectedSubject.name} ${selectedGrade}` : "Chưa chọn môn"} {'>'}
          {topics.length > 0 && selectedTopicId
            ? ` ${topics.find(topic => topic.id === selectedTopicId)?.name}`
            : "Chưa chọn chương"} {'>'}
          {selectedReviewId
            ? `${topics
              .find(topic => topic.id === selectedTopicId)
              ?.reviews?.find(review => review.id === selectedReviewId)?.name || "Không rõ"
            }`
            : "Chưa chọn bài học"}
        </Typography>
      </Box>

      {/* Box hiển thị thông tin tổng quan */}
      <Box
        className="text-lg font-bold my-4 flex flex-wrap items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-lg"
        sx={{
          maxWidth: 1200,
          width: '100%',
        }}
      >
        <Box className="flex items-center space-x-2">
          <Image src="/img/star.svg" alt="Lesson Icon" width={24} height={24} />
          <span className="font-bold text-lg text-black">
            {currentQuestion + 1}/{questionsData.length}
          </span>
        </Box>
        <Box className="flex items-center space-x-2 border rounded-lg p-2">
          <Image src="/img/clock.svg" alt="Clock Icon" width={24} height={24} />
          <span className="font-bold text-lg text-black">
            {String(Math.floor(elapsedTime / 3600)).padStart(2, '0')} :{' '}
            {String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0')} :{' '}
            {String(elapsedTime % 60).padStart(2, '0')}
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

      {/* Box hiển thị câu hỏi */}
      <Box
        className="flex flex-col items-center justify-center"
        sx={{
          maxWidth: 1000,
          width: '100%',
          height: 'auto', // Cho phép chiều cao tự động
        }}
      >
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
export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}

