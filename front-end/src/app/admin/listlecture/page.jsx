'use client'
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data can be replaced with an API call
const lectures = [
  {
    id: "1",
    title: "Introduction to Algebra",
    url: "https://example.com/algebra",
    description: "Basic concepts of Algebra.",
    type: "VIDEO",
    isViewed: true,
    reviewId: "101",
    review: { name: "Algebra Review" }
  },
  {
    id: "2",
    title: "Geometry Basics",
    url: "https://example.com/geometry",
    description: "Introduction to basic geometry.",
    type: "VIDEO",
    isViewed: false,
    reviewId: "102",
    review: { name: "Geometry Review" }
  },
  {
    id: "3",
    title: "Calculus Fundamentals",
    url: "https://example.com/calculus",
    description: "Fundamentals of calculus.",
    type: "PDF",
    isViewed: true,
    reviewId: "103",
    review: { name: "Calculus Review" }
  }
];

const LectureList = () => {
  const [lectureList, setLectureList] = useState(lectures);

  const handleEdit = (id) => {
    // Logic to edit lecture with the given id
    console.log(`Edit lecture with id: ${id}`);
    // Navigate to edit page or open a modal
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this lecture?');
    if (confirmDelete) {
      setLectureList(prevLectures => prevLectures.filter(lecture => lecture.id !== id));
      console.log(`Deleted lecture with id: ${id}`);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ padding: 2 }}>
        Danh Sách Bài Giảng
      </Typography>
      <Table aria-label="lecture table">
        <TableHead>
          <TableRow>
            <TableCell >Tiêu đề</TableCell>
            <TableCell >Link Video</TableCell>
            <TableCell >Mô tả</TableCell>
            <TableCell >Review Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lectureList.map((lecture) => (
            <TableRow key={lecture.id}>
              <TableCell >{lecture.title}</TableCell>
              <TableCell >
                <a href={lecture.url} target="_blank" rel="noopener noreferrer">
                  {lecture.url}
                </a>
              </TableCell>
              <TableCell >{lecture.description}</TableCell>
              <TableCell >{lecture.review.name}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEdit(lecture.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(lecture.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LectureList;
