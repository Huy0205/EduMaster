// pages/ontap/lythuyet.js
'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button, IconButton, CircularProgress } from '@mui/material';
import Header from '~/components/Header';
import Navbar from '~/components/Navbar';
import ReactPlayer from 'react-player';  // Import ReactPlayer
import { useState, useEffect } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import axios from 'axios';
const LyThuyet = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const lectureId = searchParams.get('lectureId');
  const lectureTitle = searchParams.get('lectureTitle');
  const lectureUrl = searchParams.get('lectureUrl');
  const [isClient, setIsClient] = useState(false);
  const [questionPages, setQuestionPages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const fetchQuestions = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/question/review/${reviewId}`);
      const data = await response.json();
      const questions = data.data.questions;
      console.log(questions);
      let pages = [];
      if (questions.length <= 5) {
        pages.push(questions);
      } else {
        let page1 = questions.slice(0, 5);
        let page2 = questions.slice(5);

        if (page2.length < 5) {
          pages.push([...page1, ...page2]);
        } else {
          pages.push(page1);
          pages.push(page2);
        }
      }

      setQuestionPages(pages);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handlePracticeQuestion = (reviewId, questionId) => {
    if (questionId === null || (Array.isArray(questionId) && questionId.length === 0)) {
      // Trigger the Snackbar with a custom message
      setOpenSnackbar(true);
    } else {
      const questionIdString = encodeURIComponent(JSON.stringify(questionId));
      // Proceed with navigation if questionId is valid
      router.push(`/ontap/thuchanh?reviewId=${reviewId}&questionId=${questionIdString}`);
    }
  };
  useEffect(() => {
    setIsClient(true);

    // Chỉ gọi fetchQuestions nếu reviewId tồn tại
    if (reviewId) {
      fetchQuestions(reviewId);
    }
  }, [reviewId]);
  const handleGoBackToOnTap = () => {
    // Khi quay lại trang Ôn tập, truyền giá trị false cho isFirstLoad
    router.push(`/ontap?initialIsFirstLoad=false`);
  };
  return (
    <Box sx={{ paddingBottom: 2, minHeight: '100vh' }} className="bg-gradient-to-r from-amber-50 to-white">
      <Header />
      <Navbar />
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 2 }}>
        <IconButton onClick={handleGoBackToOnTap}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }} className='text-black'>
          {/* {`Chương ${reviewId || ''}`} &gt; {`Bài ${lectureTitle || ''}`} */}
          {`Chương 1 > Bài 1`}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
        <Paper sx={{ maxWidth: 1200, width: '100%', p: 3 }} elevation={3}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            {lectureTitle || 'Tên bài giảng'}
          </Typography>

          {lectureUrl ? (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
              <ReactPlayer
                url={lectureUrl}
                controls
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0, borderRadius: '8px' }}
                onReady={() => setLoading(false)} // Hide spinner when video is ready
                onBuffer={() => setLoading(true)} // Show spinner when buffering starts
                onBufferEnd={() => setLoading(false)} // Hide spinner when buffering ends
              />
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              Không tìm thấy video cho bài giảng này.
            </Typography>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            {/* Nút Chuyển Trang */}
            {/* <Button
          variant="contained"
          color="primary"
          onClick={handlePracticeQuestion}
          >
              Thực Hành Câu Hỏi
          </Button> */}
          </Box>
        </Paper>
      </Box>
    </Box>

  );
};

export default LyThuyet;
