'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AddLessonPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    video: null,
    description: '',
    reviewId: '',
  });

  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Giả sử đây là logic để lấy danh sách các review từ API
    const fetchReviews = async () => {
      // Giả lập một danh sách reviews
      const reviewList = [
        { id: 1, name: 'Review 1' },
        { id: 2, name: 'Review 2' },
        { id: 3, name: 'Review 3' },
      ];
      setReviews(reviewList);
    };

    fetchReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      video: e.target.files[0], // Lưu video tải lên
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic để thêm bài học thành công
    console.log('Lesson Submitted', formData);
    setErrorMessage(''); // Xóa thông báo lỗi nếu có
    setSuccessMessage('Thêm bài học thành công!'); // Cập nhật thông báo thành công
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
      <Paper elevation={3} sx={{ padding: 8, borderRadius: 4, width: '800px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thêm Bài Học
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Tiêu Đề"
              variant="outlined"
              placeholder="Nhập tiêu đề bài học"
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ fontSize: '1.25rem' }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ width: '100%' }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Mô Tả"
              variant="outlined"
              placeholder="Nhập mô tả bài học"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ fontSize: '1.25rem' }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="review-select-label">Chọn bài học</InputLabel>
              <Select
                labelId="review-select-label"
                value={formData.reviewId}
                onChange={handleChange}
                name="reviewId"
              >
                {reviews.map((review) => (
                  <MenuItem key={review.id} value={review.id}>
                    {review.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Thêm
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddLessonPage;
