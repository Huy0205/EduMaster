'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Dữ liệu mẫu
const courses = [
  { id: 1, name: 'Mathematics', grade: 'Grade 1' },
  { id: 2, name: 'Geography', grade: 'Grade 2' }
];

const topics = [
  { id: 1, name: 'Math Basics', courseId: 1 },
  { id: 2, name: 'Geography Basics', courseId: 2 }
];

const quizzes = [
  { id: 1, name: 'Basic Math Test', time: '30 mins', topicID: 1 },
  { id: 2, name: 'Geography Test', time: '45 mins', topicID: 2 }
];

const questions = [
  { id: 1, content: 'What is 2+2?', type: 'SINGLE_CHOICE', correctAnswer: '4' },
  { id: 2, content: 'What is the capital of France?', type: 'SINGLE_CHOICE', correctAnswer: 'Paris' }
];

const quizQuestions = [
  { QuizID: 1, QuestionID: 1 },
  { QuizID: 2, QuestionID: 2 }
];

// Hàm kết hợp dữ liệu từ các bảng
const getQuizList = () => {
  return quizQuestions.map(quizQuestion => {
    const quiz = quizzes.find(q => q.id === quizQuestion.QuizID);
    const question = questions.find(q => q.id === quizQuestion.QuestionID);
    const topic = topics.find(t => t.id === quiz.topicID);
    const course = courses.find(c => c.id === topic.courseId);
    
    return {
      question_name: question.content,
      correct_answer: question.correctAnswer,
      topic_name: topic.name,
      course_name: course.name,
      grade_name: course.grade,
      quiz_name: quiz.name,
      question_id: question.id // Thêm id của câu hỏi
    };
  });
};

// Component React hiển thị danh sách bài kiểm tra
const QuizList = () => {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const quizList = getQuizList();

  const handleEdit = (quiz) => {
    setSelectedQuestion(quiz);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion(null);
  };

  const handleDelete = (id) => {
    // Logic to delete user with the given id
    console.log(`Delete user with id: ${id}`);
  };

  const handleSave = () => {
    // Logic to save changes to the question
    console.log(`Save changes for question ID: ${selectedQuestion.question_id}`);
    handleClose(); // Đóng modal sau khi lưu
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ padding: 2 }}>
          Danh Sách Bài Kiểm Tra
        </Typography>
        <Table aria-label="quiz table">
          <TableHead>
            <TableRow>
              <TableCell >Tên Câu Hỏi</TableCell>
              <TableCell >Câu Trả Lời Đúng</TableCell>
              <TableCell >Tên Chương</TableCell>
              <TableCell >Tên Môn Học</TableCell>
              <TableCell >Tên Lớp</TableCell>
              <TableCell >Tên Bài Kiểm Tra</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizList.map((quiz, index) => (
              <TableRow key={index}>
                <TableCell >{quiz.question_name}</TableCell>
                <TableCell >{quiz.correct_answer}</TableCell>
                <TableCell >{quiz.topic_name}</TableCell>
                <TableCell >{quiz.course_name}</TableCell>
                <TableCell >{quiz.grade_name}</TableCell>
                <TableCell >{quiz.quiz_name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(quiz)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(quiz.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog để chỉnh sửa câu hỏi */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chỉnh Sửa Câu Hỏi</DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Câu Hỏi"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={selectedQuestion.question_name}
              />
              <TextField
                margin="dense"
                label="Câu Trả Lời Đúng"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={selectedQuestion.correct_answer}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizList;
