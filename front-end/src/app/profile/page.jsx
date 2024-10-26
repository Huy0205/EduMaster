'use client';
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap } from "react-icons/fa";
import Header from '../../components/Header';
import { Box, Button, TextField, Typography, IconButton, Avatar, MenuItem, Alert } from '@mui/material';
import axios from "axios";

const ProfilePage = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [userId, setUserId] = useState(null); // Khởi tạo state cho userId
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // Lấy userId từ localStorage
    setUserId(storedUserId); // Cập nhật state cho userId
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setFeedbackMessage("Không tìm thấy thông tin người dùng.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`);
        const userData = response.data.data;
        setName(userData.fullName || "");
        setEmail(userData.email || "");
        setPhone(userData.phoneNumber || "");
        setGrade(userData.currentGrade || "");
        setAvatar(userData.avatar || "");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setFeedbackMessage("Không thể tải dữ liệu người dùng");
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setFeedbackMessage("Đã thay đổi ảnh đại diện");
        setTimeout(() => setFeedbackMessage(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return input;
  };

  const handleSave = async () => {
    const updatedUserData = {
      id: userId, 
      fullName: name,
      email: email,
      phoneNumber: phone,
      currentGrade: grade,
      avatar: avatar
    };
    try {
      await axios.put(`http://localhost:8080/api/v1/user/update/${userId}`, updatedUserData);
      console.log(`Update user with id: ${userId} success`);
      setIsEditing(false);
      setFeedbackMessage("Thông tin người dùng đã được cập nhật thành công!");
    } catch (error) {
      console.error(`Error updating user with id ${userId}:`, error);
      setFeedbackMessage("Cập nhật không thành công.");
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ maxWidth: '600px', mx: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 3, marginTop: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <IconButton onClick={handleAvatarClick}>
            <Avatar
              alt="User avatar"
              src={avatar}
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
            />
          </IconButton>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </Box>
        <Typography variant="h6" align="center" gutterBottom>
          Thông tin người dùng
        </Typography>
        <Box component="form" noValidate>
          <TextField
            label="Tên"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: <FaUser className="mr-2" />,
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <FaEnvelope className="mr-2" />,
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            InputProps={{
              startAdornment: <FaPhone className="mr-2" />,
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Lớp"
            fullWidth
            margin="normal"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            select
            InputProps={{
              startAdornment: <FaGraduationCap className="mr-2" />,
              disabled: !isEditing,
            }}
          >
            <MenuItem value="">Chọn Lớp</MenuItem>
            {[...Array(5)].map((_, i) => (
              <MenuItem key={i} value={i + 1}>
                Lớp {i + 1}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Lưu
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </Box>
        {feedbackMessage && (
          <Alert severity="info" sx={{ mt: 3 }}>
            {feedbackMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
