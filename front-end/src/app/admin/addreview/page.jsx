'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';

const AddReviewPage = () => {
  const [activeTab, setActiveTab] = useState('addTopic');
  const [topicName, setTopicName] = useState('');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [topics, setTopics] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Giả sử đây là logic để lấy danh sách các topic từ API
    const fetchTopics = async () => {
      const topicList = [
        { id: 1, name: 'Chương 1' },
        { id: 2, name: 'Chương 2' },
      ];
      setTopics(topicList);
    };

    // Giả sử đây là logic để lấy danh sách các review từ API
    const fetchReviews = async () => {
      const reviewList = [
        { id: 1, name: 'Bé mai tập nói' },
        { id: 2, name: 'Hình tròn' },
      ];
      setReviews(reviewList);
    };

    fetchTopics();
    fetchReviews();
  }, []);

  const handleAddTopic = () => {
    // Logic để thêm topic
    console.log('Topic Added:', topicName,reviewName);
    showMessageSucc('Thêm bài ôn tập thành công!');
    setErrorMessage('');
    setReviewName('');
    setTopicName('');
  };
  const showMessageSucc = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // ẩn thông báo sau 5 giây
  };
  const handleAddQuestion = () => {
    // Logic để thêm question
    const questionData = {
      question,
      correctAnswer,
      type: questionType,
      reviewName,
    };
    console.log('Question Added:', questionData);
    showMessageSucc('Thêm câu hỏi ôn tập thành công!');
    setErrorMessage('');
    setQuestion('');
    setCorrectAnswer('');
    setQuestionType('');
    setReviewName('');
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
          Thêm Nội Dung Ôn Tập
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button 
            variant={activeTab === 'addTopic' ? 'contained' : 'outlined'} 
            color={activeTab === 'addTopic' ? 'success' : 'default'} 
            onClick={() => setActiveTab('addTopic')}
          >
            Thêm Bài Ôn Tập
          </Button>
          <Button 
            variant={activeTab === 'addQuestion' ? 'contained' : 'outlined'} 
            color={activeTab === 'addQuestion' ? 'success' : 'default'} 
            onClick={() => setActiveTab('addQuestion')}
          >
            Thêm Câu Hỏi Ôn Tập
          </Button>
        </Stack>
        
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        
        {/* Phần Thêm Bài Ôn Tập */}
        {activeTab === 'addTopic' && (
          <Box>
            <TextField
              fullWidth
              label="Tên Bài Ôn Tập"
              variant="outlined"
              placeholder="Nhập tên bài ôn tập"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="topic-select-label">Chọn Chương</InputLabel>
              <Select
                labelId="topic-select-label"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.name}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleAddTopic} fullWidth>
              Thêm Bài Ôn Tập
            </Button>
          </Box>
        )}

        {/* Phần Thêm Câu Hỏi Ôn Tập */}
        {activeTab === 'addQuestion' && (
          <Box>
            <TextField
              fullWidth
              label="Câu Hỏi"
              variant="outlined"
              placeholder="Nhập câu hỏi"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Câu Trả Lời Đúng"
              variant="outlined"
              placeholder="Nhập câu trả lời đúng"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="question-type-select-label">Chọn Loại Câu Hỏi</InputLabel>
              <Select
                labelId="question-type-select-label"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <MenuItem value="SINGLE_CHOICE">SINGLE_CHOICE</MenuItem>
                <MenuItem value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</MenuItem>
                <MenuItem value="FILL_IN_THE_BLANK">FILL_IN_THE_BLANK</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="review-select-label">Chọn Review</InputLabel>
              <Select
                labelId="review-select-label"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
              >
                {reviews.map((review) => (
                  <MenuItem key={review.id} value={review.name}>
                    {review.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleAddQuestion} fullWidth>
              Thêm Câu Hỏi Ôn Tập
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AddReviewPage;
