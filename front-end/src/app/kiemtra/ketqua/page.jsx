'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState,Suspense } from 'react';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Icon Ngôi Nhà
import Navbar from '~/components/Navbar';
import Header from '~/components/Header'
import { getApiNoneToken } from '~/api/page';;
const KetQua = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState({});
  const [quizname, setQuizName] = useState();

  useEffect(() => {
    // Lấy các tham số từ URL
    const quizId = searchParams.get('quizId');
    const timeLeft = searchParams.get('timeLeft');
    const score = searchParams.get('score');

    if (timeLeft && score) {
      setQuizData({ timeLeft, score });
    }
    if (quizId) {
      const getQuizName = async (quizId) => {
        try {
          const response = await getApiNoneToken(`/quiz/${quizId}`);
          setQuizName(response.data.data?.name || 'Không có tên quiz');
        } catch (error) {
          console.error('Error fetching quiz name:', error);
          setQuizName('Không có tên quiz');
        }
      };

      getQuizName(quizId);
    }

  }, [searchParams]);

  // Kiểm tra nếu chưa có dữ liệu
  if (!quizData.timeLeft || !quizData.score) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column" padding={3}>
        <Typography variant="h5" sx={{ color: 'black' }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  // Chuyển đổi timeLeft từ giây sang phút:giây
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Hàm quay lại trang kiểm tra
  const goBackToQuiz = () => {
    router.push('/kiemtra');
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Header />
      <Navbar />
      <Box display="flex" justifyContent="space-between" alignItems="center" padding={2}>
        <Box display="flex" alignItems="center" onClick={goBackToQuiz} style={{ cursor: 'pointer' }}>
          <HomeIcon sx={{ color: 'black', fontSize: 30 }} />
        </Box>
      </Box>

      {/* Nội dung kết quả */}
      <Box display="flex" justifyContent="start" alignItems="center" flexDirection="column" flex={1} padding={3}>
        <Typography variant="h4" sx={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>
          Kết quả bài kiểm tra
        </Typography>
        <Typography variant="h5" sx={{ color: 'black', fontSize: 28, marginTop: 2 }}>
          Đề kiểm tra: {quizname}
        </Typography>
        <Typography variant="h5" sx={{ color: 'black', fontSize: 28, marginTop: 2 }}>
          Thời gian làm bài: {formatTime(Number(quizData.timeLeft))}
        </Typography>
        <Typography variant="h5" sx={{ color: 'black', fontSize: 28, marginTop: 2 }}>
          Số điểm đạt được: {quizData.score}/10
        </Typography>

        {/* Nút Xong */}
        <Box marginTop={4}>
          <Button variant="contained" color="primary" onClick={goBackToQuiz}>
            Xong
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KetQua />
    </Suspense>
  );
}
