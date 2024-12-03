'use client'
import React, { useState } from 'react'
import { Box, Button, Typography, TextField, CircularProgress, Divider } from "@mui/material";
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { useAuth } from '~/context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { postApiNoneToken } from '~/api/page'
import Header from '../../components/Header';
const LoginPage = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    let data = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const res = await postApiNoneToken("/user/login", data);
      if (res.data) {
        const userId = res.data.data.user.id;
        localStorage.setItem('userId', userId);
        console.log(userId);
        setLoggedIn(true);
        localStorage.setItem('loggedIn', 'true');
        router.push('/');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch (error) {
      console.log(error);
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (credentialRespone) => {
    setLoggedIn(true);
    router.push('/');
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Header />

      {/* Form container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #3b82f6, #9333ea)",
          py: 12,
          px: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: "100%",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            color="text.primary"
            mb={2}
          >
            Đăng nhập
          </Typography>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <Box mb={2}>
              <TextField
                id="email-address"
                name="email"
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1 }}>
                      <AiOutlineMail />
                    </Box>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                id="password"
                name="password"
                type="password"
                label="Mật khẩu"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1 }}>
                      <AiOutlineLock />
                    </Box>
                  ),
                }}
              />
            </Box>

            {/* Thông báo lỗi */}
            {error && (
              <Typography
                variant="body2"
                color="error"
                align="center"
                sx={{ mb: 2 }}
              >
                {error}
              </Typography>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          {/* Divider */}
          {/* <Box mt={4}>
            <Divider>
              <Typography variant="body2" color="textSecondary">
                Hoặc
              </Typography>
            </Divider>
          </Box> */}

          {/* Google Login */}
          {/* <Button
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle />}
            onClick={handleGoogleLogin}
            sx={{ mt: 2, py: 1.5 }}
          >
            Đăng nhập bằng Google
          </Button> */}

          {/* Đăng ký */}
          <Box
            mt={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="body2">Bạn chưa có tài khoản?</Typography>
            <Button
              sx={{ ml: 1 }}
              onClick={() => {
                router.push("/register");
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
