'use client'
import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, Typography, Select, MenuItem } from '@mui/material';
import Header from '~/components/Header';
import Navbar from '~/components/Navbar';
import { useRouter } from 'next/navigation';
import { getApiNoneToken } from '~/api/page';
const Topic = ({ title, isActive, onClick }) => {
    return (
        <Paper elevation={2} sx={{ mb: 2, p: 1 }}>
            <Button
                onClick={onClick}
                fullWidth
                sx={{
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    backgroundColor: isActive ? '#e3f2fd' : 'white',
                    color: isActive ? '#1e88e5' : 'black',
                }}
            >
                <Typography variant="subtitle1">{title}</Typography>
            </Button>
        </Paper>
    );
};

const Kiemtra = () => {
    const [selectedSubject, setSelectedSubject] = useState('Toán');
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getApiNoneToken(`course/grade/${selectedGrade}`);
                const data = response.data;
                setCourses(data.data);
                if (data.data.length > 0) {
                    setSelectedSubject(data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [selectedGrade]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedSubject) {
                try {
                    const response = await getApiNoneToken(`topic/course/${selectedSubject.id}`);
                    const topicsData = response.data;
                    setTopics(topicsData.data);
                } catch (error) {
                    console.error('Error fetching topics:', error);
                }
            }
        };

        fetchTopics();
    }, [selectedSubject]);

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
    const handleViewQuiz = (quizId) => {
        // Truyền thêm quizId vào URL
        router.push(`/kiemtra/lambai?quizId=${quizId}`);
    };
    return (
        <Box className="bg-gradient-to-r from-amber-50 to-white" sx={{ minHeight: '100vh' }}>
            <Header />
            <Navbar />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 2 }}>
                {/* Các nút "Toán" và "Tiếng Việt" */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {courses.map((course, index) => (
                        <Button
                            key={index}
                            variant={selectedSubject === course ? 'contained' : 'outlined'}
                            onClick={() => setSelectedSubject(course)}
                            sx={{
                                width: 150,
                                height: 100,
                                flexDirection: 'column',
                                color: selectedSubject === course ? 'white' : 'primary.main',
                                bgcolor: selectedSubject === course ? 'primary.main' : 'white',
                            }}
                        >
                            <Box
                                sx={{
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={`/img/${course.name === 'Toán' ? 'icon_math_on.png' : 'icon_vietnamese_literature_on.png'
                                        }`}
                                    alt={`${course.name} Icon`}
                                    style={{ width: 40, height: 40 }}
                                />
                            </Box>
                            <Typography variant="subtitle1">{course.name}</Typography>
                        </Button>
                    ))}
                </Box>

                {/* Select "Lớp" đặt cùng hàng */}
                <Box>
                    <Select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                        sx={{
                            width: 150,
                            height: 40,
                            ml: 21, // Tạo khoảng cách giữa các nút và phần chọn lớp
                        }}
                    >
                        <MenuItem value={1}>Lớp 1</MenuItem>
                        <MenuItem value={2}>Lớp 2</MenuItem>
                        <MenuItem value={3}>Lớp 3</MenuItem>
                    </Select>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', mt: 2 }}>
                {/* Topics Sidebar */}
                <Paper sx={{
                    width: '25%', p: 2, height: 'calc(91vh - 200px)', overflowY: 'auto',
                    backgroundImage: 'url(/img/bg-topic.jpg)', // Đường dẫn tới hình nền trong thư mục public/img
                    backgroundSize: 'cover', // Để hình nền bao phủ toàn bộ Box
                    backgroundPosition: 'center', // Căn giữa hình nền
                    marginLeft: 1,
                }} elevation={3}>
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
                <Box component="main" flex={1} marginRight={4} marginLeft={4} display="grid" gridTemplateColumns="1fr" gap={4}>
                    {/* Quizzes Section */}
                    <Paper className="p-4">
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
                                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                            {quiz.name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}
                                            onClick={() => handleViewQuiz(quiz.id)}
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
