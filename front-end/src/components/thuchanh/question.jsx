import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Checkbox, Box, Radio } from '@mui/material';
import Image from 'next/image';
import { postApiNoneToken  } from '~/api/page';

function Question({ question, onNext, onSubmitAnswer, questionlist,userId,pargesId }) {
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
  
    const handleNext = async () => {
      setSelectedAnswer([]);
      setUserAnswer('');
      setIsAnswered(false);
      setIsCorrect(false);
      try {
        await postApiNoneToken('practice-progress/add', {
          userId: userId,
          practiceId: pargesId,
          lastQuestionIndex: questionlist+1, 
        });
        console.log(`Cập nhật lastQuestionIndex: ${questionlist+1}`);
      } catch (error) {
        console.error('Lỗi khi cập nhật lastQuestionIndex:', error);
      }
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
              maxHeight: '150px',
              objectFit: 'contain',
            }}
          />
        </Box>
      );
    };
    return (
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
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
          position="relative"
        >
  
          <Typography variant="h6" gutterBottom className='text-black font-bold' sx={{ fontSize: 32 }}>
            Câu {questionlist + 1}: {question.content}
          </Typography>
  
  
          {renderImage(question.image)}
  
          <Box display="flex" flexDirection="column" width="100%" sx={{ position: 'relative' }}>
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
                  <Typography className='text-black' sx={{ fontSize: 32 }}>{answer.content}</Typography>
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
              <Box sx={{
                position: 'absolute',
                top:60, // Đặt phần chú thích ở phía dưới
                width: '100%',
                textAlign: 'center',
              }}>
                <Typography color={isCorrect ? 'green' : 'red'} sx={{ mt: 2, fontSize: 26 }}>
                  {isCorrect ? (
                    'Câu trả lời chính xác!'
                  ) : (
                    <>
                     Câu trả lời đúng là:{" "}
                      <Typography component="span" color="green" sx={{ fontSize: 26 }}>
                        {question.answers
                          .filter(answer => answer.isCorrect)
                          .map(answer => answer.content)
                          .join(', ')}
                      </Typography>
                    </>
                  )}
                </Typography>
              </Box>
            )}
          </Box>
  
          <Box display="flex" justifyContent="center" mt={1} sx={{
            position: 'absolute', // Fix the position of the button container
            bottom: 20, // Thêm khoảng cách từ dưới lên
            width: '100%',
          }}>
            {isAnswered ? (
              <Button variant="contained" onClick={handleNext} sx={{
                width: '1000px', // Tăng độ rộng
                height: '50px', // Tăng chiều cao
                fontSize: '16px', // Tăng cỡ chữ
                fontWeight: 'bold', // Tăng độ đậm
                borderRadius: '10px', // Làm nút tròn hơn
              }}>Câu Tiếp</Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit} sx={{
                width: '1000px', // Tăng độ rộng
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
export default Question