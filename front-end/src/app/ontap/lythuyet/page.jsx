'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import ReactPlayer from 'react-player';
import { useState, useEffect, Suspense } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';

import Header from '~/components/Header';
import Navbar from '~/components/Navbar';
import { useOntapContext } from '~/context/OntapContext';

const LyThuyet = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        selectedCourse,
        selectedTopic,
        selectedLesson,
        selectedTheory,
        setSelectedPractice,
        firstPracticeInLesson,
    } = useOntapContext();

    useEffect(() => {
        setIsClient(true);
        console.log(isClient);
        console.log(loading);
    }, []);

    // const fetchQuestions = async (reviewId) => {
    //     try {
    //         const response = await getApiNoneToken(`practice/lesson/${reviewId}`);
    //         const data = response.data;
    //         if (Array.isArray(data.data) && data.data.length > 0) {
    //             const firstQuestion = data.data[0];

    //             const questionId = firstQuestion.id;

    //             console.log('First question ID:', questionId);

    //             setQuestionPages(data.data);
    //         } else {
    //             console.error('No data found or data is not an array');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching questions:', error);
    //     }
    // };

    const handleShowPractice = () => {
        setSelectedPractice(firstPracticeInLesson);
        router.push('/ontap/thuchanh');
    };

    // useEffect(() => {
    //     setIsClient(true);
    //     if (reviewId) {
    //         fetchQuestions(reviewId);
    //     }
    //     if (selectedTopicId) {
    //         fetchTopicName(selectedTopicId);
    //     }
    // }, [reviewId, topicId]);

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
                    {selectedCourse
                        ? `${selectedCourse.name} ${selectedCourse.grade}`
                        : 'Chưa chọn môn'}{' '}
                    {'> '}
                    {`${selectedTopic?.name || ''}`} &gt; {`${selectedLesson?.name || ''}`}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Paper
                    sx={{ maxWidth: 1200, width: '100%', p: 3 }}
                    elevation={3}
                >
                    {selectedTheory ? (
                        <Box sx={{ position: 'relative', paddingTop: '52%' }}>
                            {/* 16:9 Aspect Ratio */}
                            <ReactPlayer
                                url={selectedTheory.url}
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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowPractice}
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
