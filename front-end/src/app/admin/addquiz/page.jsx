'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';

const AddQuizPage = () => {
  const [activeTab, setActiveTab] = useState('createQuiz');
  const [quizName, setQuizName] = useState('');
  const [quizTime, setQuizTime] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null); // State to store selected question details
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      const topicList = [
        { id: 1, name: 'Chương 1' },
        { id: 2, name: 'Chương 2' },
      ];
      setTopics(topicList);
    };

    const fetchQuestions = async () => {
      const questionList = [
        {
          id: '1',
          content: 'What is 2 + 2?',
          type: 'SINGLE_CHOICE',
          correctAnswer: '4', // Correct answer field added
          review: { id: 'r1', name: 'Basic Math' },
          answers: [
            { id: 'a1', content: '3', iscorrect: false },
            { id: 'a2', content: '4', iscorrect: true },
          ],
        },
        {
          id: '2',
          content: 'What is the capital of France?',
          type: 'SINGLE_CHOICE',
          correctAnswer: 'Paris',
          review: { id: 'r2', name: 'Geography Basics' },
          answers: [
            { id: 'a3', content: 'London', iscorrect: false },
            { id: 'a4', content: 'Paris', iscorrect: true },
          ],
        },
      ];
      setQuestions(questionList);
    };

    fetchTopics();
    fetchQuestions();
  }, []);

  const handleQuestionChange = (event) => {
    const questionId = event.target.value;
    setSelectedQuestion(questionId);
    // Find the selected question details
    const questionDetails = questions.find(q => q.id === questionId);
    setSelectedQuestionDetails(questionDetails);
  };

  const showMessage = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleCreateQuiz = () => {
    const quizData = {
      name: quizName,
      time: quizTime,
      topicId: selectedTopic,
    };
    console.log('Quiz Created:', quizData);
    showMessage('Tạo đề kiểm tra thành công!');
    setQuizName('');
    setQuizTime('');
    setSelectedTopic('');
  };

  const handleAddQuestionToQuiz = () => {
    const questionData = {
      quizId: 1,
      questionId: selectedQuestion,
    };
    console.log('Question Added to Quiz:', questionData);
    showMessage('Câu hỏi đã được thêm vào đề kiểm tra!');
    setSelectedQuestion('');
    setSelectedQuestionDetails(null); // Reset details after adding
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: '800px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thêm Nội Dung Kiểm Tra
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button 
            variant={activeTab === 'createQuiz' ? 'contained' : 'outlined'} 
            color={activeTab === 'createQuiz' ? 'success' : 'default'} 
            onClick={() => setActiveTab('createQuiz')}
          >
            Tạo Đề Kiểm Tra
          </Button>
          <Button 
            variant={activeTab === 'addQuestionToQuiz' ? 'contained' : 'outlined'} 
            color={activeTab === 'addQuestionToQuiz' ? 'success' : 'default'} 
            onClick={() => setActiveTab('addQuestionToQuiz')}
          >
            Thêm Câu Hỏi vào Đề Kiểm Tra
          </Button>
        </Stack>
        
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        
        {activeTab === 'createQuiz' && (
          <Box>
            <TextField
              fullWidth
              label="Tên Đề Kiểm Tra"
              variant="outlined"
              placeholder="Nhập tên đề kiểm tra"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Thời Gian (phút)"
              variant="outlined"
              placeholder="Nhập thời gian"
              value={quizTime}
              onChange={(e) => setQuizTime(e.target.value)}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="topic-select-label">Chọn Chương</InputLabel>
              <Select
                labelId="topic-select-label"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleCreateQuiz} fullWidth>
              Tạo Đề Kiểm Tra
            </Button>
          </Box>
        )}

        {activeTab === 'addQuestionToQuiz' && (
          <Box>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="question-select-label">Chọn Câu Hỏi</InputLabel>
              <Select
                labelId="question-select-label"
                value={selectedQuestion}
                onChange={handleQuestionChange}
              >
                {questions.map((question) => (
                  <MenuItem key={question.id} value={question.id}>
                    {question.content} {/* Show the content of the question */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Display additional information about the selected question */}
            {selectedQuestionDetails && (
             <Box sx={{ mb: 3, gap: 10 }}>
             <Typography variant="h6">Thông tin câu hỏi:</Typography>
             <TextField
               label="Loại"
               variant="outlined"
               value={selectedQuestionDetails.type}
               InputProps={{
                 readOnly: true,
               }}
               fullWidth
               sx={{ mb: 2 }} // Increased margin bottom for spacing
             />
             <TextField
               label="Câu Trả Lời Đúng"
               variant="outlined"
               value={selectedQuestionDetails.correctAnswer}
               InputProps={{
                 readOnly: true,
               }}
               fullWidth
               sx={{ mb: 2 }} // Increased margin bottom for spacing
             />
             <TextField
               label="Tên Bài Ôn"
               variant="outlined"
               value={selectedQuestionDetails.review.name}
               InputProps={{
                 readOnly: true,
               }}
               fullWidth
               sx={{ mb: 0 }} // No bottom margin for the last field
             />
           </Box>
           
            )}
            
            <Button variant="contained" color="primary" onClick={handleAddQuestionToQuiz} fullWidth>
              Thêm Câu Hỏi vào Đề Kiểm Tra
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AddQuizPage;
