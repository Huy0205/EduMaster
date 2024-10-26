'use client'
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { postApiNoneToken } from '~/api/page'
const AddUserPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    currentGrade: '',
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
  const showMessage = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  const phoneNumberPattern = /^\d{10}$/;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phoneNumber, password, currentGrade } = formData;
    if (!fullName || !email || !phoneNumber || !password || !currentGrade) {
      setErrorMessage('Chưa nhập đủ dữ liệu');
      setSuccessMessage('');
      return;
    }
    else if (!phoneNumberPattern.test(phoneNumber)) {
      alert('Số điện thoại phải gồm đúng 10 số.');
      return;
    }
    try {
        const res = await postApiNoneToken("user/register", formData)
        if (res.data && res.data.code === 400 && res.data.message === 'Email is already exist') {
          setErrorMessage('Email đã tồn tại ');
        }else if(res.data && res.data.code === 400 && res.data.message === 'Phone number is already exist'){
          setErrorMessage('Số điện thoại đã tồn tại');
        } 
  
        else if (res.data) {
          console.log('Form Submitted', formData);
          showMessage('Thêm tài khoản thành công');
          setErrorMessage('');
          setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            currentGrade: '',
          });
        }
      } catch (error) {
        console.log("Lỗi",error);
      }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: '800px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thêm Tài Khoản
        </Typography>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tên Người Dùng"
              variant="outlined"
              placeholder="Nhập tên"
              name="fullName"
              value={formData.fullName}
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
              name="phoneNumber"
              value={formData.phoneNumber}
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
            <FormControl fullWidth variant="outlined">
              <InputLabel id="grade-label">Lớp</InputLabel>
              <Select
                labelId="grade-label"
                label="Lớp"
                name="currentGrade"
                value={formData.currentGrade}
                onChange={handleChange}
              >
                <MenuItem value="1">Lớp 1</MenuItem>
                <MenuItem value="2">Lớp 2</MenuItem>
                <MenuItem value="3">Lớp 3</MenuItem>
                <MenuItem value="4">Lớp 4</MenuItem>
                <MenuItem value="5">Lớp 5</MenuItem>
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

export default AddUserPage;
