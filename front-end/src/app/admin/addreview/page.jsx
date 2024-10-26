'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';
import axios from 'axios';
const AddReviewPage = () => {
  const [activeTab, setActiveTab] = useState('addTopic');
  const [topicName, setTopicName] = useState('');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [topics, setTopics] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [grades, setGrades] = useState([]); // Danh sách lớp
  const [courses, setCourses] = useState([]); // Danh sách môn học
  const [selectedGrade, setSelectedGrade] = useState(''); // Lớp được chọn
  const [selectedCourse, setSelectedCourse] = useState(''); // Môn học được chọn
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Giả sử đây là logic để lấy danh sách lớp từ API
    const fetchGrades = async () => {
      const gradesList = [
        { id: 1, name: 'Lớp 1' },
        { id: 2, name: 'Lớp 2' },
      ];
      setGrades(gradesList);
    };

    fetchGrades();
  }, []);

  useEffect(() => {
    // Khi lớp được chọn, gọi API để lấy danh sách môn học
    const fetchCourses = async () => {
      if (selectedGrade) {
        const response = await fetch(`http://localhost:8080/api/v1/course/grade/${selectedGrade}`);
        const data = await response.json();
        setCourses(data.data || []); // Lưu danh sách môn học
      }
    };

    fetchCourses();
  }, [selectedGrade]);

  useEffect(() => {
    // Khi môn học được chọn, gọi API để lấy danh sách chủ đề
    const fetchTopics = async () => {
      if (selectedCourse) {
        const response = await fetch(`http://localhost:8080/api/v1/topic/course/${selectedCourse}`);
        const data = await response.json();
        setTopics(data.data || []); // Lưu danh sách chủ đề
      }
    };

    fetchTopics();
  }, [selectedCourse]);

  const handleAddTopic = async () => {
    // Kiểm tra xem tên bài ôn tập và bài ôn tập đã được nhập chưa
    if (!topicName || !reviewName) {
      setErrorMessage('Vui lòng nhập tên bài ôn tập và chọn bài ôn tập.');
      return;
    }
  
    // Dữ liệu cần gửi
    const data = {
      name: reviewName,
      topicId: topicName, 
    };
  
    try {
      console.log(data);
      // Gửi yêu cầu POST đến API
      const response = await axios.post('http://localhost:8080/api/v1/review/add', data);
      
      // Kiểm tra phản hồi từ API
      if (response.data) {
        console.log('Thêm bài ôn tập thành công:', response.data);
        showMessageSucc('Thêm bài ôn tập thành công!');
        setErrorMessage('');
        setReviewName(''); // Xóa tên bài ôn tập
        setTopicName(''); // Xóa tên chương
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm bài ôn tập:', error);
      setErrorMessage('Có lỗi xảy ra khi thêm bài ôn tập. Vui lòng thử lại.');
    }
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
          {/* <Button
            variant={activeTab === 'addQuestion' ? 'contained' : 'outlined'}
            color={activeTab === 'addQuestion' ? 'success' : 'default'}
            onClick={() => setActiveTab('addQuestion')}
          >
            Thêm Câu Hỏi Ôn Tập
          </Button> */}
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
              <InputLabel id="grade-select-label">Chọn Lớp</InputLabel>
              <Select
                labelId="grade-select-label"
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedCourse(''); // Reset môn học khi lớp thay đổi
                  setTopics([]); // Reset chủ đề khi lớp thay đổi
                }}
              >
                {grades.map((grade) => (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="course-select-label">Chọn Môn Học</InputLabel>
              <Select
                labelId="course-select-label"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setTopicName(''); // Reset chủ đề khi môn học thay đổi
                }}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="topic-select-label">Chọn Chương</InputLabel>
              <Select
                labelId="topic-select-label"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
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
              <InputLabel id="review-name-select-label">Chọn Bài Ôn Tập</InputLabel>
              <Select
                labelId="review-name-select-label"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
              >
                {reviews.map((review) => (
                  <MenuItem key={review.id} value={review.id}>
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
