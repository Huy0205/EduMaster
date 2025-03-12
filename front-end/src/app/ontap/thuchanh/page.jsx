'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getApiNoneToken, postApiNoneToken, putApiNoneToken } from '~/api/page';
import Question from '~/components/thuchanh/question';
import { useOntapContext } from '~/context/OntapContext';
import { useAuth } from '~/context/AuthContext';

const Home = () => {
    const router = useRouter();

    const { auth, setAuth, isLoadingAuth } = useAuth();
    const { user } = auth;
    const { selectedCourse, selectedTopic, selectedLesson, selectedPractice } = useOntapContext();

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timeTaken, setTimeTaken] = useState(null);
    const [score, setScore] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            if (selectedPractice) {
                try {
                    const [questionsRes, progressRes] = await Promise.all([
                        getApiNoneToken(`question/practice/${selectedPractice.id}`),
                        getApiNoneToken(
                            `practice-progress/user/${user.id}/practice/${selectedPractice.id}`,
                        ),
                    ]);

                    const { data: questionsData, message: questionsMessage } = questionsRes.data;
                    if (questionsData) {
                        setQuestions(questionsData);
                    } else {
                        throw new Error(questionsMessage);
                    }

                    const { data: progressData, message: progressMessage } = progressRes.data;
                    if (progressData === null) {
                        await postApiNoneToken('practice-progress/add', {
                            userId: user.id,
                            practiceId: selectedPractice.id,
                            lastQuestionIndex: 0,
                        });
                    } else if (progressData === undefined) {
                        throw new Error(progressMessage);
                    } else {
                        if (progressData.lastQuestionIndex < questionsData.length)
                            setCurrentQuestion(progressData.lastQuestionIndex);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchData();
    }, [isLoadingAuth, router, selectedPractice, user]);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleNextQuestion = () => {
        setCurrentQuestion((prev) => prev + 1);
    };

    useEffect(() => {
        if (currentQuestion >= questions.length && timeTaken === null) {
            setTimeTaken(elapsedTime);
        }
    }, [currentQuestion, elapsedTime, questions.length, timeTaken]);

    const handleAnswerSubmission = (isCorrect) => {
        if (isCorrect) {
            setScore((prev) => prev + 1);
        } else {
            setIncorrectAnswers((prev) => prev + 1);
        }
    };

    const handleFinish = async () => {
        router.push('/ontap');
        let bonusPoint = selectedPractice.bonusPoint;
        if (score < questions.length / 2) {
            return;
        } else if (score === questions.length) {
            bonusPoint *= 2;
        }

        try {
            const currentPoints = user.totalPoint;
            const updatedPoints = currentPoints + bonusPoint;
            await putApiNoneToken(`user/update/${user.id}`, {
                totalPoint: updatedPoints,
            });

            setAuth((prevAuth) => ({
                ...prevAuth,
                user: {
                    ...prevAuth.user,
                    totalPoint: updatedPoints,
                },
            }));
        } catch (error) {
            console.error('Lỗi khi cập nhật điểm:', error);
        }
    };

    if (currentQuestion >= questions.length) {
        return (
            <Box
                className="min-h-screen flex flex-col items-center"
                sx={{
                    backgroundImage: 'url(/img/bg-question.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Header />
                <Navbar />
                <Box
                    className="p-6 text-center"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: '8px',
                        boxShadow: 3,
                        maxWidth: 1000,
                        margin: '8px',
                        padding: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ fontWeight: 'bold' }}
                        className="text-black"
                    >
                        Hoàn thành bài ôn tập
                    </Typography>
                    <Box mt={2}>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            mt={1}
                        >
                            Số câu đúng: {score} / {questions.length}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            mt={1}
                        >
                            Số câu sai: {incorrectAnswers} / {questions.length}
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ width: '100%', py: 1 }}
                            onClick={handleFinish}
                        >
                            Xong
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            className="min-h-screen flex flex-col items-center"
            sx={{
                backgroundImage: 'url(/img/bg-question.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Header />
            <Navbar />

            {/* Box hiển thị thông tin bài học */}
            <Box sx={{ maxWidth: 800 }}>
                {' '}
                {/* Thêm margin-top để tách khỏi Navbar */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#000' }}
                >
                    {selectedCourse
                        ? `${selectedCourse.name} ${selectedCourse.grade}`
                        : 'Chưa chọn môn'}{' '}
                    {'> '}
                    {`${selectedTopic?.name || ''}`} &gt; {`${selectedLesson?.name || ''}`}
                </Typography>
            </Box>

            {/* Box hiển thị thông tin tổng quan */}
            <Box
                className="text-lg font-bold my-4 flex flex-wrap items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-lg"
                sx={{
                    maxWidth: 1200,
                    width: '100%',
                }}
            >
                <Box className="flex items-center space-x-2">
                    <Image
                        src="/img/star.svg"
                        alt="Lesson Icon"
                        width={24}
                        height={24}
                    />
                    <span className="font-bold text-lg text-black">
                        {currentQuestion + 1}/{questions.length}
                    </span>
                </Box>
                <Box className="flex items-center space-x-2 border rounded-lg p-2">
                    <Image
                        src="/img/clock.svg"
                        alt="Clock Icon"
                        width={24}
                        height={24}
                    />
                    <span className="font-bold text-lg text-black">
                        {String(Math.floor(elapsedTime / 3600)).padStart(2, '0')} :{' '}
                        {String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0')} :{' '}
                        {String(elapsedTime % 60).padStart(2, '0')}
                    </span>
                </Box>
                <Box className="flex items-center space-x-1">
                    <Image
                        src="/img/correctPractice.png"
                        alt="Correct Icon"
                        width={24}
                        height={24}
                    />
                    <span className="text-green-600 font-bold text-lg">{score}</span>
                </Box>
                <Box className="flex items-center space-x-1">
                    <Image
                        src="/img/wrongPractice.png"
                        alt="Incorrect Icon"
                        width={24}
                        height={24}
                    />
                    <span className="text-red-600 font-bold text-lg">{incorrectAnswers}</span>
                </Box>
            </Box>

            {/* Box hiển thị câu hỏi */}
            <Box
                className="flex flex-col items-center justify-center"
                sx={{
                    maxWidth: 1000,
                    width: '100%',
                    height: 'auto', // Cho phép chiều cao tự động
                }}
            >
                {questions.length > 0 ? (
                    <Question
                        question={questions[currentQuestion]}
                        questionlist={currentQuestion}
                        onNext={handleNextQuestion}
                        onSubmitAnswer={handleAnswerSubmission}
                        userId={user.id}
                        pargesId={selectedPractice.id}
                    />
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Box>
    );
};
export default function PageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Home />
        </Suspense>
    );
}
