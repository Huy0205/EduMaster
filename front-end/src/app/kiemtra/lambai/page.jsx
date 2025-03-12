'use client';
import React, { useState, useEffect, Suspense } from 'react';
import {
    Button,
    Radio,
    Checkbox,
    TextField,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import FlagIcon from '@mui/icons-material/Flag';

import { getApiNoneToken, postApiNoneToken, putApiNoneToken } from '~/api/page';
import { useAuth } from '~/context/AuthContext';
import { useKiemtraContext } from '~/context/KiemtraContext';

const Quiz = () => {
    const router = useRouter();

    const { auth, setAuth } = useAuth();
    const { user } = auth;
    const { selectedQuiz, setTimeSpent, setScore } = useKiemtraContext();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [totalQuizTime, setTotalQuizTime] = useState(0);
    const [flaggedQuestions, setFlaggedQuestions] = useState([]);

    useEffect(() => {
        const fetchTime = async () => {
            if (selectedQuiz) {
                setTimeLeft(selectedQuiz.time * 60);
                setTotalQuizTime(selectedQuiz.time * 60);

                try {
                    const response = await getApiNoneToken(`question/quiz/${selectedQuiz.id}`);
                    const { data, message } = response.data;
                    if (data) {
                        setQuestions(data);
                    } else {
                        throw new Error(message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchTime();
    }, [selectedQuiz]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleAutoSubmit = () => {
        handleSubmitResult();
    };

    const handleSubmit = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const toggleFlag = (questionId) => {
        setFlaggedQuestions((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId],
        );
    };
    const updateUserPoints = async (score) => {
        let bonusPoint = selectedQuiz.bonusPoint;
        if (score < 5) {
            return;
        }
        if (score === 10) {
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

    const handleSubmitResult = async () => {
        try {
            const correctCount = questions.reduce((count, question) => {
                const userAnswer = answers[question.id];
                if (question.type === 1 || question.type === 2) {
                    const isCorrect = question.answers.every((answer) => {
                        return (
                            (answer.isCorrect && userAnswer?.includes(answer.id)) ||
                            (!answer.isCorrect && !userAnswer?.includes(answer.id))
                        );
                    });
                    return isCorrect ? count + 1 : count;
                } else if (question.type === 3) {
                    const isCorrect =
                        question.answers[0]?.content.toLowerCase() === userAnswer?.toLowerCase();
                    return isCorrect ? count + 1 : count;
                }
                return count;
            }, 0);
            const totalQuestions = questions.length;
            const maxScore = 10;
            const score = (correctCount / totalQuestions) * maxScore;
            await updateUserPoints(score);
            const payload = {
                userId: user.id,
                quizId: selectedQuiz.id,
                score,
                correctCount,
            };

            await postApiNoneToken('result/add', payload);

            setTimeSpent(totalQuizTime - timeLeft);
            setScore(score.toFixed(2));
            router.push(`/kiemtra/ketqua`);
        } catch (error) {
            console.error('Error submitting result:', error);
        }
    };

    const renderQuestion = (question) => {
        if (question.type === 1) {
            return question.answers.map((answer) => (
                <label
                    key={answer.id}
                    className="flex items-center space-x-2"
                >
                    <Radio
                        checked={answers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                    />
                    <Typography sx={{ color: 'black', fontSize: 32 }}>{answer.content}</Typography>
                </label>
            ));
        }

        if (question.type === 2) {
            return question.answers.map((answer) => (
                <label
                    key={answer.id}
                    className="flex items-center space-x-2"
                >
                    <Checkbox
                        checked={answers[question.id]?.includes(answer.id)}
                        onChange={(e) => {
                            const updatedAnswers = answers[question.id] || [];
                            handleAnswerChange(
                                question.id,
                                e.target.checked
                                    ? [...updatedAnswers, answer.id]
                                    : updatedAnswers.filter((a) => a !== answer.id),
                            );
                        }}
                    />
                    <Typography sx={{ color: 'black', fontSize: 32 }}>{answer.content}</Typography>
                </label>
            ));
        }

        if (question.type === 3) {
            return (
                <TextField
                    variant="outlined"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Nhập câu trả lời"
                    fullWidth
                    sx={{ input: { color: 'black' }, fontSize: 32 }}
                />
            );
        }

        return null;
    };

    const handleHomeClick = () => {
        setConfirmExit(true);
    };

    const handleExitConfirm = (confirm) => {
        if (confirm) {
            router.push('/kiemtra'); // Quay về trang kiểm tra nếu đồng ý thoát
        }
        setConfirmExit(false);
    };

    return (
        <Box
            display="flex"
            height="90vh"
            bgcolor="#f5f5f5"
        >
            {/* Main Content */}
            <Box
                flex={2}
                display="flex"
                flexDirection="column"
                padding={3}
                bgcolor="#ffffff"
                borderRadius={2}
                gap={5}
            >
                {/* Layout trên: Home button + Time */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '2px solid #ccc' }}
                >
                    <IconButton onClick={handleHomeClick}>
                        <HomeIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                    <Typography
                        variant="h5"
                        sx={{ color: 'black', fontSize: 32 }}
                    >
                        Thời gian còn lại: <span style={{ color: 'red' }}>{formatTime()}</span>
                    </Typography>
                    <Box />
                </Box>

                {questions.length > 0 ? (
                    <>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            padding={2}
                        >
                            <Typography
                                variant="h5"
                                sx={{ color: 'black', fontSize: 32, flex: 1 }}
                            >
                                Câu {currentQuestion + 1}: {questions[currentQuestion].content}
                            </Typography>
                            <IconButton
                                onClick={() => toggleFlag(questions[currentQuestion].id)}
                                sx={{
                                    color: flaggedQuestions.includes(questions[currentQuestion].id)
                                        ? 'red'
                                        : 'black',
                                }}
                            >
                                <FlagIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Box>
                        {questions[currentQuestion].image && (
                            <Box
                                display="flex"
                                justifyContent="center"
                            >
                                {questions[currentQuestion].image.startsWith('http') ? (
                                    <img
                                        src={questions[currentQuestion].image}
                                        alt="Question"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'contain',
                                        }}
                                    />
                                ) : (
                                    questions[currentQuestion].image
                                        .toLowerCase()
                                        .startsWith('text_') && (
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: 32,
                                            }}
                                        >
                                            {questions[currentQuestion].image.slice(5)}
                                        </Typography>
                                    )
                                )}
                            </Box>
                        )}
                        <Box>{renderQuestion(questions[currentQuestion])}</Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            marginTop="auto"
                        >
                            {currentQuestion > 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                >
                                    Câu trước
                                </Button>
                            )}
                            {currentQuestion < questions.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                >
                                    Câu tiếp
                                </Button>
                            ) : (
                                <Typography></Typography>
                            )}
                        </Box>
                    </>
                ) : (
                    <Typography
                        variant="h6"
                        sx={{ color: 'black' }}
                    >
                        Đang tải câu hỏi...
                    </Typography>
                )}
            </Box>

            {/* Navigation Panel */}
            <Box
                flex={1}
                padding={3}
                ml={4}
                bgcolor="#ffffff"
                borderRadius={2}
            >
                <Typography
                    variant="h6"
                    sx={{ color: 'black', fontSize: 32 }}
                    gutterBottom
                >
                    Danh sách câu hỏi
                </Typography>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(5, 1fr)"
                    gap={1}
                >
                    {questions.map((q, index) => {
                        const isFlagged = flaggedQuestions.includes(q.id);
                        const isAnswered = !!answers[q.id];
                        const isCurrent = currentQuestion === index;

                        return (
                            <Button
                                key={q.id}
                                variant="contained"
                                onClick={() => setCurrentQuestion(index)}
                                sx={{
                                    border: isCurrent ? '2px solid gold' : '1px solid #ccc',
                                    fontWeight: isCurrent ? 'bold' : 'normal',
                                    backgroundColor: isFlagged
                                        ? 'red'
                                        : isAnswered
                                        ? 'green'
                                        : 'inherit',
                                    color: isFlagged ? 'white' : 'inherit',
                                }}
                            >
                                {index + 1}
                            </Button>
                        );
                    })}
                </Box>

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={2}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                        sx={{ flex: 1 }}
                    >
                        Nộp bài
                    </Button>
                </Box>
            </Box>

            {/* Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle>Trạng thái câu hỏi</DialogTitle>
                <DialogContent>
                    {questions.map((q, index) => (
                        <Typography
                            key={q.id}
                            sx={{ color: answers[q.id] ? 'black' : 'red', marginBottom: '8px' }}
                        >
                            Câu {index + 1}:{' '}
                            {answers[q.id] ? 'Đã ghi nhận câu trả lời' : 'Chưa có câu trả lời'}
                        </Typography>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        color="primary"
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={async () => {
                            await handleSubmitResult();
                            setDialogOpen(false);
                        }}
                        color="secondary"
                        variant="contained"
                    >
                        Xác nhận nộp
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Xác nhận thoát */}
            {confirmExit && (
                <Dialog
                    open={confirmExit}
                    onClose={() => setConfirmExit(false)}
                >
                    <DialogTitle>Xác nhận</DialogTitle>
                    <DialogContent>
                        <Typography>Bạn có chắc chắn muốn thoát bài kiểm tra?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleExitConfirm(false)}>Hủy</Button>
                        <Button
                            onClick={() => handleExitConfirm(true)}
                            color="secondary"
                        >
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default function PageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Quiz />
        </Suspense>
    );
}
