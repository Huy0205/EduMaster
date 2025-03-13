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
import Loading from '~/app/admin/components/loading';

const LyThuyet = () => {
    const router = useRouter();

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
        if (!selectedTheory) {
            router.replace('/ontap');
        } else {
            setLoading(false);
        }
    }, [selectedLesson, selectedTheory, router]);

    const handleShowPractice = () => {
        setSelectedPractice(firstPracticeInLesson);
        router.push('/ontap/thuchanh');
    };

    const handleGoBackToOnTap = () => {
        router.push('/ontap');
    };

    return (
        <Box className="w-screen h-screen flex flex-col items-center bg-amber-50">
            <Header />
            <Navbar />
            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <>
                    <Box
                        sx={{
                            width: '80%',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            my: 2,
                            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                            borderRadius: 2,
                        }}
                    >
                        <IconButton onClick={handleGoBackToOnTap}>
                            <ArrowBack fontSize="large" />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{ ml: 1 }}
                            className="text-black"
                            suppressHydrationWarning
                        >
                            {`${selectedCourse?.name} ${selectedCourse?.grade} > ${selectedTopic?.name} > ${selectedLesson?.name}`}
                        </Typography>
                    </Box>
                    {/* Video Container */}
                    <Box
                        sx={{
                            width: '80%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'black',
                            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                            borderRadius: 2,
                            borderEndStartRadius: 0,
                            borderEndEndRadius: 0,
                        }}
                    >
                        <Paper
                            sx={{
                                width: '100%',
                                maxWidth: '750px',
                            }}
                        >
                            {selectedTheory ? (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        paddingTop: '56.25%',
                                    }}
                                >
                                    {/* 16:9 Aspect Ratio */}
                                    <ReactPlayer
                                        url={`${selectedTheory.url}?rel=0`}
                                        controls
                                        width="100%"
                                        height="100%"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            // objectFit: 'cover',
                                        }}
                                        config={{
                                            youtube: {
                                                playerVars: {
                                                    rel: 0,
                                                    modestbranding: 1,
                                                    playsinline: 1,
                                                },
                                            },
                                        }}
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
                        </Paper>
                        <Box
                            sx={{
                                width: '100%',
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTop: 1,
                                borderColor: 'lightgrey',
                                backgroundColor: 'white',
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShowPractice}
                            >
                                Thực hành ngay
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
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
