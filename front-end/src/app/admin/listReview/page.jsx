'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topics, setTopics] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
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
    const fetchCourses = async () => {
      if (selectedGrade) {
        const response = await fetch(`http://localhost:8080/api/v1/course/grade/${selectedGrade}`);
        const data = await response.json();
        setCourses(data.data || []);
      }
    };

    fetchCourses();
  }, [selectedGrade]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedCourse) {
        const response = await fetch(`http://localhost:8080/api/v1/topic/course/${selectedCourse}`);
        const data = await response.json();
        setTopics(data.data || []);
      }
    };

    fetchTopics();
  }, [selectedCourse]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (topicName) {
        const response = await fetch(`http://localhost:8080/api/v1/review/${topicName}`);
        const data = await response.json();
        if (data.code === 200) {
          setReviews(data.data); // Lưu danh sách bài ôn tập vào state
        }
      }
    };

    fetchReviews();
  }, [topicName]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/review/${id}`);
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion(null);
  };
  const handleEditOpen = (review) => {
    setCurrentUser(review);
    setOpen(true);
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/review/${selectedQuestion.id}`, {
        content: editedContent,
      });
      if (response.status === 200) {
        // Cập nhật danh sách câu hỏi với câu hỏi đã sửa
        const updatedReviews = reviews.map((review) => {
          if (review.id === selectedQuestion.id) {
            return { ...review, content: editedContent };
          }
          return review;
        });
        setReviews(updatedReviews);
        handleClose();
      }
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ padding: 2 }}>
        Danh Sách Câu Hỏi
      </Typography>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={4}>
          <InputLabel id="grade-select-label">Chọn Lớp</InputLabel>
          <Select
            labelId="grade-select-label"
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setSelectedCourse('');
              setTopics([]);
            }}
            fullWidth
            size="small"
          >
            {grades.map((grade) => (
              <MenuItem key={grade.id} value={grade.id}>
                {grade.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <InputLabel id="course-select-label">Chọn Môn Học</InputLabel>
          <Select
            labelId="course-select-label"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setTopicName('');
            }}
            fullWidth
            size="small"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <InputLabel id="topic-select-label">Chọn Chương</InputLabel>
          <Select
            labelId="topic-select-label"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            fullWidth
            size="small"
          >
            {topics.map((topic) => (
              <MenuItem key={topic.id} value={topic.id}>
                {topic.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thứ Tự</TableCell>
              <TableCell>Tên Bài Ôn Tập</TableCell>
              <TableCell>Điểm Thưởng</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.order}</TableCell>
                <TableCell>{review.name}</TableCell>
                <TableCell>{review.bonusPoint}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditOpen(review)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(review.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Chỉnh sửa thông tin bài ôn tập</DialogTitle>
      <DialogContent>
          {currentUser && (
            <>
              <DialogContentText>
                Vui lòng chỉnh sửa thông tin bài ôn tập.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                name="Name"
                label="Tên bài ôn tập"
                type="text"
                fullWidth
                variant="outlined"
                value={currentUser.name}
              />
              <TextField
                margin="dense"
                name="text"
                label="Điểm thưởng"
                type="text"
                fullWidth
                variant="outlined"
                value={currentUser.bonusPoint}              
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleClose} color="primary">
            Xong
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionList;
