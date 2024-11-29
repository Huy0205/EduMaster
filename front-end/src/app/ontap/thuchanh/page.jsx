'use client';
import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Checkbox, Box, Radio } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const searchParams = useSearchParams();
  const pargesId = searchParams.get('pargesId');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const router = useRouter();

  const chapterName = "Chương 1";
  const lessonName = "Bài 1: Vị Trí";
  const exerciseName = "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/question/practice/${pargesId}`);
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

  const handleFinish = () => {
    router.push('/ontap');
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

function Question({ question, onNext, onSubmitAnswer }) {
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

  const handleAnswerChange = (answerId) => {
    if (question.type === '1' || question.type === 1) {
      setSelectedAnswer([answerId]);
    } else if (question.type === '2' || question.type === 2) {
      setSelectedAnswer((prev) =>
        prev.includes(answerId) ? prev.filter((id) => id !== answerId) : [...prev, answerId]
      );
    }
  };

  const handleSubmit = () => {
    let correct = false;
    if (question.type === '1' || question.type === '2' || question.type === 1 || question.type === 2) {
      correct = question.answers.every(
        (answer) =>
          (selectedAnswer.includes(answer.id) && answer.isCorrect) ||
          (!selectedAnswer.includes(answer.id) && !answer.isCorrect)
      );
    } else if (question.type === '3' || question.type === 3) {
      correct = userAnswer.trim().toLowerCase() === question.answers[0].content.trim().toLowerCase();
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
  const renderImage = (image) => {
    if (!image) {
      return null; // Trường hợp `null`, không hiển thị
    }
    if (image.startsWith("text_") || image.startsWith("Text_")) {
      const displayText = image.split("_")[1]; // Lấy phần sau dấu gạch dưới "_"
      return (
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
          {displayText}
        </Typography>
      );
    }
    // Hiển thị URL ảnh
    return (
      <Box mt={2} display="flex" justifyContent="center" alignItems="center">
        <Image
          src={image}
          alt="Question Image"
          layout="intrinsic"
          width={500}
          height={300}
          style={{
            maxWidth: '100%',
            maxHeight: '250px',
            objectFit: 'contain',
          }}
        />
      </Box>
    );
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
        minWidth="1200px"
        height="670px"
        bgcolor="background.paper"
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h6" gutterBottom className='text-black' sx={{fontSize:32}}>
          {question.content}
        </Typography>

        {renderImage(question.image)}

        {(question.type === '1' || question.type === 1 || question.type === '2' || question.type === 2) ? (
          question.answers.map((answer) => (
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
              <Typography className='text-black' sx={{fontSize:32}}>{answer.content}</Typography>
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
          <Typography color={isCorrect ? 'green' : 'red'} sx={{ mt: 2,fontSize:32 }}>
            {isCorrect ? (
              'Câu trả lời chính xác!'
            ) : (
              <>
                Sai rồi! Câu trả lời chính là:{" "}
                <Typography component="span" color="green" sx={{fontSize:32}}>
                  {question.answers
                    .filter(answer => answer.isCorrect)
                    .map(answer => answer.content)
                    .join(', ')}
                </Typography>
              </>
            )}
          </Typography>
        )}

        <Box display="flex" justifyContent="center" mt={1}>
          {isAnswered ? (
            <Button variant="contained" onClick={handleNext}sx={{
              width: '1200px', // Tăng độ rộng
              height: '50px', // Tăng chiều cao
              fontSize: '16px', // Tăng cỡ chữ
              fontWeight: 'bold', // Tăng độ đậm
              borderRadius: '10px', // Làm nút tròn hơn
            }}>Tiếp theo</Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}sx={{
              width: '1200px', // Tăng độ rộng
              height: '50px', // Tăng chiều cao
              fontSize: '16px', // Tăng cỡ chữ
              fontWeight: 'bold', // Tăng độ đậm
              borderRadius: '10px', // Làm nút tròn hơn
            }}>Trả lời</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
