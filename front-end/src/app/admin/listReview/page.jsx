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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data
const mockData = [
  {
    id: 'q1',
    content: 'What is 2 + 2?',
    type: 'SINGLE_CHOICE',
    order: 1,
    answers: [
      { id: 'a1', content: '3', iscorrect: false, feedback: 'Incorrect', questionId: 'q1' },
      { id: 'a2', content: '4', iscorrect: true, feedback: 'Correct', questionId: 'q1' },
    ],
    review: { id: 'r1', name: 'Basic Math', order: 1, bonusPoint: 5, topicId: 1 },
  },
  // ... other questions
];

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    // Simulate API fetch with mock data
    const fetchQuestions = async () => {
      setQuestions(mockData);
    };

    fetchQuestions();
  }, []);

  const handleEdit = (id) => {
    const questionToEdit = questions.find((question) => question.id === id);
    setSelectedQuestion(questionToEdit);
    setEditedContent(questionToEdit.content);
    setOpen(true);
  };

  const handleDelete = (id) => {
    // Logic to delete user with the given id
    console.log(`Delete user with id: ${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion(null);
  };

  const handleSubmit = () => {
    // Logic to handle form submission for editing
    const updatedQuestions = questions.map((question) => {
      if (question.id === selectedQuestion.id) {
        return { ...question, content: editedContent };
      }
      return question;
    });
    setQuestions(updatedQuestions);
    handleClose();
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 4,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Danh Sách Câu Hỏi
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nội Dung</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Câu Trả Lời Đúng</TableCell>
                <TableCell>Thứ Tự</TableCell>
                <TableCell>Tên Bài Ôn Tập</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.content}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>
                    {question.answers
                      .filter((answer) => answer.iscorrect)
                      .map((answer) => answer.content)
                      .join(', ')}
                  </TableCell>
                  <TableCell>{question.order}</TableCell>
                  <TableCell>{question.review.name}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(question.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(question.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sửa Câu Hỏi</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nội Dung"
            type="text"
            fullWidth
            variant="outlined"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionList;
