'use client'
import { useState, useEffect } from "react";
import { Box, Avatar, Button, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";

const initialData = [
  { id: 1, url: "/iframe/img/s3_3.png", status: true, islock: false },
  { id: 2, url: "/iframe/img/s1_6.png", status: false, islock: true },
  { id: 3, url: "/iframe/img/s1_7.png", status: false, islock: true },
  { id: 4, url: "/iframe/img/s1_8.png", status: false, islock: false },
  { id: 5, url: "/iframe/img/s2_4.png", status: false, islock: false },
];

const UserAvatarPage = () => {
  const [userId, setUserId] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [frames, setFrames] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId || null);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`);
        const userData = response.data.data;
        setAvatar(userData.avatar || "");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleUnlock = (id) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) =>
        frame.id === id ? { ...frame, islock: false } : frame
      )
    );
  };

  const handleUse = (id) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) =>
        frame.id === id
          ? { ...frame, status: true } 
          : { ...frame, status: false } 
      )
    );
  };

  if (loading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box className="flex flex-col items-center">
      <Header />
      <Navbar />
      {/* Danh sách frames hiển thị hàng ngang */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "center",
          flexWrap: "wrap",
          mt: 4,
        }}
      >
        {frames.map((frame) => (
          <Box
            key={frame.id}
            sx={{
              position: "relative",
              width: 120,
              height: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={frame.url}
              alt={`Frame ${frame.id}`}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                zIndex: 2, 
              }}
            />
            <Avatar
              src={avatar}
              alt="User avatar"
              sx={{
                width: 60,
                height: 60,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1, 
              }}
            />
            <Box sx={{ mt: 2 }}>
              {frame.status ? (
                <Typography variant="body2" color="textSecondary">
                  Đang sử dụng
                </Typography>
              ) : frame.islock ? (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUnlock(frame.id)}
                >
                  Mở khóa
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleUse(frame.id)}
                >
                  Sử dụng
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserAvatarPage;
