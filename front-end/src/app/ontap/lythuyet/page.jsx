// pages/ontap/lythuyet.js
'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import Header from '~/components/Header';
import Navbar from '~/components/Navbar';
import ReactPlayer from 'react-player'; // Import ReactPlayer
import { useState, useEffect, Suspense } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { getApiNoneToken } from '~/api/page';
import { useOntapContext } from '~/context/OntapContext';

const LyThuyet = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reviewId = searchParams.get('reviewId');
    const lectureTitle = searchParams.get('lectureTitle');
    const lectureUrl = searchParams.get('lectureUrl');
    const topicId = searchParams.get('topicId');
    const [isClient, setIsClient] = useState(false);
    const [topicname, setTopicName] = useState();
    const [questionPages, setQuestionPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const { selectedSubject, selectedGrade, selectedTopicId } = useOntapContext();

    useEffect(() => {
        setIsClient(true);
        console.log(isClient);
        console.log(loading);
    }, []);
    const fetchQuestions = async (reviewId) => {
        try {
            const response = await getApiNoneToken(`practice/lesson/${reviewId}`);
            const data = response.data;
            if (Array.isArray(data.data) && data.data.length > 0) {
                const firstQuestion = data.data[0];

                const questionId = firstQuestion.id;

                console.log('First question ID:', questionId);

                setQuestionPages(data.data);
            } else {
                console.error('No data found or data is not an array');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };
    const fetchTopicName = async (topicId) => {
        try {
            const response = await getApiNoneToken(`topic/${topicId}`);
            const data = response.data;
            if (data && data.data) {
                setTopicName(data.data.name);
                console.log(data.data.name);
            } else {
                console.error('Topic not found');
            }
        } catch (error) {
            console.error('Error fetching topic name:', error);
        }
    };
    const handlePracticeQuestion = (reviewId) => {
        if (questionPages.length > 0) {
            const firstQuestionId = questionPages[0]?.id;
            router.push(`/ontap/thuchanh?reviewId=${reviewId}&pargesId=${firstQuestionId}`);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (reviewId) {
            fetchQuestions(reviewId);
        }
        if (selectedTopicId) {
            fetchTopicName(selectedTopicId);
        }
    }, [reviewId, topicId]);
    const handleGoBackToOnTap = () => {
        router.push('/ontap');
    };
    return (
        <Box
            sx={{ paddingBottom: 2, minHeight: '100vh' }}
            className="bg-gradient-to-r from-amber-50 to-white"
        >
            <Header />
            <Navbar />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 2 }}>
                <IconButton onClick={handleGoBackToOnTap}>
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Typography
                    variant="h6"
                    sx={{ ml: 1 }}
                    className="text-black"
                >
                    {selectedSubject ? `${selectedSubject.name} ${selectedGrade}` : 'Chưa chọn môn'}{' '}
                    {'> '}
                    {`${topicname || ''}`} &gt; {`${lectureTitle || ''}`}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Paper
                    sx={{ maxWidth: 1200, width: '100%', p: 3 }}
                    elevation={3}
                >
                    {lectureUrl ? (
                        <Box sx={{ position: 'relative', paddingTop: '52%' }}>
                            {' '}
                            {/* 16:9 Aspect Ratio */}
                            <ReactPlayer
                                url={lectureUrl}
                                controls
                                width="100%"
                                height="95%"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    borderRadius: '8px',
                                }}
                                onReady={() => setLoading(false)} // Hide spinner when video is ready
                                onBuffer={() => setLoading(true)} // Show spinner when buffering starts
                                onBufferEnd={() => setLoading(false)} // Hide spinner when buffering ends
                            />
                        </Box>
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{ mt: 2, textAlign: 'center' }}
                        >
                            Không tìm thấy video cho bài giảng này.
                        </Typography>
                    )}

                    <Box sx={{ textAlign: 'center' }}>
                        {/* Nút Chuyển Trang */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePracticeQuestion(reviewId)}
                        >
                            Thực hành ngay
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default function PageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LyThuyet />
        </Suspense>
    );
}
