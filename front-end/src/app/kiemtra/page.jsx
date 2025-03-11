'use client';
import React, { useEffect } from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import Header from '~/components/Header';
import Navbar from '~/components/Navbar';
import { useRouter } from 'next/navigation';
import { getApiNoneToken } from '~/api/page';
import Topic from '~/components/kiemtra/topic';
import { useKiemtraContext } from '~/context/KiemtraContext';
import { useAuth } from '~/context/AuthContext';

const Kiemtra = () => {
    const { auth, isLoadingAuth } = useAuth();
    const {
        selectedCourse,
        setSelectedCourse,
        // selectedGrade,
        // setSelectedGrade,
        courses,
        setCourses,
        topics,
        setTopics,
        selectedTopicId,
        setSelectedTopicId,
        quizzes,
        setQuizzes,
    } = useKiemtraContext();

    const router = useRouter();

    useEffect(() => {
        if (!isLoadingAuth && !auth.user) {
            router.push('/login');
            return;
        }

        const fetchCourses = async () => {
            try {
                const response = await getApiNoneToken(`course/grade/${auth.user.currentGrade}`);
                const data = response.data;
                setCourses(data.data);
                if (data.data.length > 0) {
                    setSelectedCourse(data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingAuth, auth.user]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedCourse) {
                try {
                    const response = await getApiNoneToken(`topic/course/${selectedCourse.id}`);
                    const topicsData = response.data;
                    setTopics(topicsData.data);
                } catch (error) {
                    console.error('Error fetching topics:', error);
                }
            }
        };

        fetchTopics();
    }, [selectedCourse]);

    const handleTopicClick = async (topicId) => {
        setSelectedTopicId(topicId);
        try {
            const response = await getApiNoneToken(`quiz/topic/${topicId}`);
            const quizzesData = response.data;
            setQuizzes(quizzesData.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };
    const handleViewQuiz = (quiz) => {
        // Truyền thêm quizId vào URL
        router.push(`/kiemtra/lambai?quizId=${quiz.id}&bonusPoint=${quiz.bonusPoint}`);
    };

    return (
        <Box className="w-screen h-screen flex flex-col bg-amber-50">
            <Header />
            <Navbar />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 2 }}>
                {/* Các nút "Toán" và "Tiếng Việt" */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {courses.length > 0 &&
                        courses.map((course, index) => (
                            <Button
                                key={index}
                                variant={selectedCourse === course ? 'contained' : 'outlined'}
                                onClick={() => setSelectedCourse(course)}
                                sx={{
                                    width: 180,
                                    height: 100,
                                    flexDirection: 'column',
                                    color: selectedCourse === course ? 'white' : 'primary.main',
                                    bgcolor: selectedCourse === course ? 'primary.main' : 'white',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img
                                        src={`/img/${
                                            course.name === 'Toán'
                                                ? 'icon_math_on.png'
                                                : 'icon_vietnamese_literature_on.png'
                                        }`}
                                        alt={`${course.name} Icon`}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </Box>
                                <Typography variant="subtitle1">{course.name}</Typography>
                            </Button>
                        ))}
                </Box>
            </Box>

            <Box className="flex flex-grow min-h-0 overflow-hidden m-4 mt-0">
                {/* Topics Sidebar */}
                <Paper
                    className="w-1/5 overflow-y-auto p-3 pr-1 pb-0  bg-[url('/img/bg-topic.jpg')] bg-cover bg-center"
                    elevation={3}
                >
                    {Array.isArray(topics) && topics.length > 0 ? (
                        topics.map((topic) => (
                            <Topic
                                key={topic.id}
                                title={topic.name}
                                isActive={selectedTopicId === topic.id}
                                onClick={() => handleTopicClick(topic.id)}
                            />
                        ))
                    ) : (
                        <Typography variant="body1"></Typography>
                    )}
                </Paper>
                {/* Main Content */}
                <Box
                    component="main"
                    flex={1}
                    marginLeft={2}
                    display="flex"
                    gridTemplateColumns="1fr 1fr"
                    gap={2}
                >
                    {/* Quizzes Section */}
                    <Paper
                        className="flex-1 p-4 flex flex-col overflow-y-auto"
                        elevation={3}
                    >
                        {quizzes.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 2,
                                }}
                            >
                                {quizzes.map((quiz) => (
                                    <Paper
                                        key={quiz.id}
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            borderRadius: 2,
                                        }}
                                        elevation={3}
                                    >
                                        <Box
                                            component="img"
                                            src="/img/quiz.jfif"
                                            alt="Quiz Image"
                                            sx={{ width: '100%', height: '190px', borderRadius: 1 }}
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mt: 2, fontWeight: 'bold' }}
                                        >
                                            {quiz.name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{
                                                mt: 1,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() => handleViewQuiz(quiz)}
                                        >
                                            Kiểm tra ngay
                                        </Button>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1"></Typography>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Kiemtra;
