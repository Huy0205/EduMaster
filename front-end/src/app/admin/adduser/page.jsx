'use client'
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu không khớp');
      return;
    }
    // Xử lý logic thêm người dùng
    console.log('Form Submitted', formData);
    setSuccessMessage('Thêm tài khoản thành công');
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
          Thêm Tài Khoản
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tên Người Dùng"
              variant="outlined"
              placeholder="Nhập tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              placeholder="Nhập email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              variant="outlined"
              placeholder="Nhập số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Mật khẩu"
              variant="outlined"
              placeholder="Nhập mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nhập lại mật khẩu"
              variant="outlined"
              placeholder="Nhập lại mật khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Thêm
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddUserPage;
