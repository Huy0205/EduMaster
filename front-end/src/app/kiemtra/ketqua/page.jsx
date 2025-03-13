'use client';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import { useKiemtraContext } from '~/context/KiemtraContext';

const KetQua = () => {
    const router = useRouter();

    const { selectedQuiz, timeSpent, score } = useKiemtraContext();

    const goBackToQuiz = () => {
        router.push('/kiemtra');
    };

    useEffect(() => {
        if (!selectedQuiz) {
            goBackToQuiz();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedQuiz]);

    // Chuyển đổi timeSpent từ giây sang phút:giây
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
            sx={{ backgroundColor: 'white' }}
        >
            <Header />
            <Navbar />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    onClick={goBackToQuiz}
                    style={{ cursor: 'pointer' }}
                >
                    <HomeIcon sx={{ color: 'black', fontSize: 30 }} />
                </Box>
            </Box>

            {/* Nội dung kết quả */}
            <Box
                display="flex"
                justifyContent="start"
                alignItems="center"
                flexDirection="column"
                flex={1}
                padding={3}
            >
                <Typography
                    variant="h4"
                    sx={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}
                >
                    Kết quả bài kiểm tra
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'black', fontSize: 28, marginTop: 2 }}
                >
                    Đề kiểm tra: {selectedQuiz?.name}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'black', fontSize: 28, marginTop: 2 }}
                >
                    Thời gian làm bài: {formatTime(Number(timeSpent))}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'black', fontSize: 28, marginTop: 2 }}
                >
                    Số điểm đạt được: {score}/10
                </Typography>

                {/* Nút Xong */}
                <Box marginTop={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={goBackToQuiz}
                    >
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
