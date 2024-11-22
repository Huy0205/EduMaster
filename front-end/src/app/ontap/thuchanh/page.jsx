'use client';
import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Checkbox, Box, Radio } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
export default function Home() {
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const questionIdString = searchParams.get('questionId');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [answerData, setAnswerData] = useState([]); // Mảng lưu câu trả lời
  const router = useRouter();
  const chapterName = "Chương 1";
  const lessonName = "Bài 2";
  const exerciseName = "Bài tập Trắc nghiệm";

  useEffect(() => {
    if (questionIdString) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(questionIdString));
        setQuestionsData(decodedData);
      } catch (error) {
        console.error('Error parsing questionId:', error);
      }
    }
  }, [questionIdString]);

  useEffect(() => {
    const fetchAnswer = async () => {
      const questionId = questionsData[currentQuestion]?.id;  // Lấy ID của câu hỏi hiện tại
      if (questionId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/answer/question/${questionId}`);
          setAnswerData(response.data.data);  // Lưu dữ liệu câu trả lời
        } catch (error) {
          console.error('Error fetching answer:', error);
        }
      }
    };

    fetchAnswer();
  }, [currentQuestion, questionsData]);

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
      setTimeTaken(elapsedTime); // Set the timeTaken when all questions are done
    }
  }, [currentQuestion, elapsedTime, questionsData.length, timeTaken]);
  const handleAnswerSubmission = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }
  };

  // Finish the quiz, navigate to a results page or the next step
  const handleFinish = () => {
    router.push('/ontap');  // Navigate to /ontap
  };
  if (currentQuestion >= questionsData.length && timeTaken === null) {
    setTimeTaken(elapsedTime);
  }
  if (currentQuestion >= questionsData.length) {
    return (
      <Box className="min-h-screen flex flex-col items-center" sx={{
        backgroundImage: 'url(/img/bg-question.jpg)', // Đường dẫn tới hình nền trong thư mục public/img
        backgroundSize: 'cover', // Để hình nền bao phủ toàn bộ Box
        backgroundPosition: 'center', // Căn giữa hình nền
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
            {/* <Typography variant="body1" color="textSecondary">
         Thời gian làm: {Math.floor(timeTaken / 60)} phút {timeTaken % 60} giây
       </Typography> */}
            <Typography variant="body1" color="textSecondary" mt={1}>
              Số câu đúng: {score} / {questionsData.length}
            </Typography>
            <Typography variant="body1" color="textSecondary" mt={1}>
              Số câu sai: {incorrectAnswers} / {questionsData.length}
            </Typography>
          </Box>

          {/* Finish Button */}
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
          {chapterName} {'>'} {lessonName} {'>'} {exerciseName}
        </Typography>
      </Box>
      <Box className="text-lg font-bold my-4 flex items-center space-x-6 bg-white p-4 rounded-lg shadow-lg " sx={{
        maxWidth: 800,
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
            answerData={answerData}
            onNext={handleNextQuestion}
            onSubmitAnswer={handleAnswerSubmission}
          />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Box>
  );
}

function Question({ question, onNext, onSubmitAnswer, answerData }) {
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAudio, setCorrectAudio] = useState(null);
  const [failAudio, setFailAudio] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCorrectAudio(new Audio('/amthanh/Traloidung.mp3'));
      setFailAudio(new Audio('/amthanh/Traloisai.mp3'));
    }
  }, []);
  console.log("Current Question:", question);
  console.log("Question Type:", question?.type);
  console.log("Answer Data:", answerData);

  const handleAnswerChange = (answerId) => {
    if (question.type === '1' || question.type === 1) {
      // For radio (type 1), only allow one selection
      setSelectedAnswer([answerId]);
    } else if (question.type === '2' || question.type === 2) {
      // For checkbox (type 2), allow multiple selections
      setSelectedAnswer((prev) =>
        prev.includes(answerId) ? prev.filter((id) => id !== answerId) : [...prev, answerId]
      );
    }
  };

  const handleSubmit = () => {
    let correct = false;
    if (question.type === '1' || question.type === '2' || question.type === 1 || question.type === 2) {
      correct = answerData.every(
        (answer) =>
          (selectedAnswer.includes(answer.id) && answer.isCorrect) ||
          (!selectedAnswer.includes(answer.id) && !answer.isCorrect)
      );
    } else if (question.type === '3' || question.type === 3) {
      correct = userAnswer.trim().toLowerCase() === answerData[0].content.trim().toLowerCase();
    }

    setIsAnswered(true);
    setIsCorrect(correct);
    onSubmitAnswer(correct);

    if (correct) {
      correctAudio.play();
    } else {
      failAudio.play();
    }
  };

  const handleNext = () => {
    setSelectedAnswer([]);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    onNext();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" sx={{ marginTop: 10 }}>
      <Box
        p={3}
        border={1}
        borderColor="grey.300"
        borderRadius="8px"
        boxShadow={3}
        width="100%"
        maxWidth="800px"
        height="670px" // Chiều cao cố định
        bgcolor="background.paper"
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="center" // Đảm bảo nút và nội dung nằm trong khung
      >
        <Typography variant="h6" gutterBottom className='text-black'>
          {question.content}
        </Typography>

        {question.image && (
          <Box mt={2} display="flex" justifyContent="center" alignItems="center">
            <Image
              src={question.image}
              alt="Question Image"
              layout="intrinsic"
              width={500} // Độ rộng tối đa
              height={300} // Chiều cao tối đa
              style={{
                maxWidth: '100%', // Giới hạn độ rộng tối đa theo container
                maxHeight: '250px', // Giới hạn chiều cao tối đa
                objectFit: 'contain', // Bảo đảm hình ảnh không bị méo
              }}
            />
          </Box>
        )}

        {(question.type === '1' || question.type === 1 || question.type === '2' || question.type === 2) ? (
          answerData.map((answer) => (
            <Box key={answer.id} display="flex" alignItems="center" mb={1}>
              {question.type === 1 ? (
                <Radio
                  checked={selectedAnswer.includes(answer.id)}
                  onChange={() => handleAnswerChange(answer.id)}
                />
              ) : (
                <Checkbox
                  checked={selectedAnswer.includes(answer.id)}
                  onChange={() => handleAnswerChange(answer.id)}
                />
              )}
              <Typography className='text-black'>{answer.content}</Typography>
            </Box>
          ))
        ) : (
          <TextField
            fullWidth
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Nhập câu trả lời"
            sx={{ mt: 2 }}
          />
        )}
        {isAnswered && (
            <Typography color={isCorrect ? 'green' : 'red'} sx={{ mt: 2 }}>
              {isCorrect ? (
                'Câu trả lời chính xác!'
              ) : (
                <>
                  Sai rồi! Câu trả lời chính là:{" "}
                  <Typography component="span" color="green">
                    {answerData
                      .filter(answer => answer.isCorrect)
                      .map(answer => answer.content)
                      .join(', ')}
                  </Typography>
                </>
              )}
            </Typography>
        )}

        <Box display="flex" justifyContent="center" mt={2}>
          {isAnswered ? (
            <Button variant="contained" onClick={handleNext}>Tiếp theo</Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>Trả lời</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
