'use client';
import { useEffect, useState } from 'react';
import { Grid, MenuItem, TextField, Typography, Paper, Box } from '@mui/material';

import { getApiNoneToken } from '~/api/page';
import Chart from '~/components/tiendo/Chart';
import Pie1 from '~/components/tiendo/Pie';
import Header from '~/components/Header';
import Navbar from '~/components/Navbar';
import { useAuth } from '~/context/AuthContext';
import { useRouter } from 'next/navigation';

const Statistics = () => {
    const router = useRouter();

    const [quizData, setQuizData] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [topics, setTopics] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);

    const { auth, isLoadingAuth } = useAuth();

    useEffect(() => {
        if (!isLoadingAuth && !auth.user) {
            router.replace('/login');
            return;
        }
        if (auth.user) {
            setSelectedGrade(auth.user.currentGrade);
        }
    }, [isLoadingAuth, auth.user, router]);

    // Lấy danh sách môn học dựa vào lớp
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getApiNoneToken(`course/grade/${selectedGrade}`);
                const data = response.data;
                setCourses(data.data || []);
                if (data.data.length > 0) {
                    setSelectedSubject(data.data[0]); // Mặc định chọn môn đầu tiên
                } else {
                    setSelectedSubject(null);
                    setTopics([]);
                    setSelectedTopic(null);
                    setQuizzes([]);
                    setSelectedQuiz(null);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [selectedGrade]);

    // Lấy danh sách chương dựa vào môn học
    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedSubject) {
                try {
                    const response = await getApiNoneToken(`topic/course/${selectedSubject.id}`);
                    const topicsData = response.data;
                    setTopics(topicsData.data);
                    if (topicsData.data.length > 0) {
                        setSelectedTopic(topicsData.data[0]); // Mặc định chọn chương đầu tiên
                    } else {
                        setSelectedTopic(null);
                        setQuizzes([]);
                        setSelectedQuiz(null);
                    }
                } catch (error) {
                    console.error('Error fetching topics:', error);
                }
            }
        };
        fetchTopics();
    }, [selectedSubject]);

    // Lấy danh sách bài kiểm tra dựa vào chương
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (selectedTopic) {
                try {
                    const response = await getApiNoneToken(`quiz/topic/${selectedTopic.id}`);
                    const quizzesData = response.data;
                    setQuizzes(quizzesData.data);
                    if (quizzesData.data.length > 0) {
                        setSelectedQuiz(quizzesData.data[0]); // Mặc định chọn bài kiểm tra đầu tiên
                    } else {
                        setSelectedQuiz(null);
                    }
                } catch (error) {
                    console.error('Error fetching quizzes:', error);
                }
            }
        };
        fetchQuizzes();
    }, [selectedTopic]);

    // Lấy danh sách kết quả quiz
    useEffect(() => {
        if (selectedQuiz) {
            const fetchData = async () => {
                try {
                    const response = await getApiNoneToken(
                        `/result/user/${auth.user.id}/quiz/${selectedQuiz.id}`,
                    );
                    console.log('quizz', response);
                    setQuizData(response.data.data);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                }
            };
            fetchData();
        } else {
            // Reset dữ liệu khi chưa chọn bài kiểm tra
            setQuizData([]);
        }
    }, [auth.user, selectedQuiz]);

    return (
        <div className="w-screen h-screen flex flex-col bg-amber-50">
            <Header />
            <Navbar />
            <div className="flex-1 flex flex-col">
                {/* Dropdown chọn lớp, môn, chương, và bài kiểm tra */}
                <div className="m-4 p-5 rounded-md shadow-lg bg-white">
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* Chọn lớp */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                select
                                label="Chọn lớp"
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                variant="outlined"
                            >
                                {[1, 2].map((grade) => (
                                    <MenuItem
                                        key={grade}
                                        value={grade}
                                    >
                                        Lớp {grade}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Chọn môn */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                select
                                label="Chọn môn"
                                value={selectedSubject ? selectedSubject.id : ''}
                                onChange={(e) =>
                                    setSelectedSubject(
                                        courses.find((course) => course.id === e.target.value),
                                    )
                                }
                                variant="outlined"
                            >
                                {courses.map((course) => (
                                    <MenuItem
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Chọn chương */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                select
                                label="Chọn chương"
                                value={selectedTopic ? selectedTopic.id : ''}
                                onChange={(e) =>
                                    setSelectedTopic(
                                        topics.find((topic) => topic.id === e.target.value),
                                    )
                                }
                                variant="outlined"
                            >
                                {topics.map((topic) => (
                                    <MenuItem
                                        key={topic.id}
                                        value={topic.id}
                                    >
                                        {topic.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Chọn bài kiểm tra */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                select
                                label="Chọn bài kiểm tra"
                                value={selectedQuiz ? selectedQuiz.id : ''}
                                onChange={(e) =>
                                    setSelectedQuiz(
                                        quizzes.find((quiz) => quiz.id === e.target.value),
                                    )
                                }
                                variant="outlined"
                            >
                                {quizzes.map((quiz) => (
                                    <MenuItem
                                        key={quiz.id}
                                        value={quiz.id}
                                    >
                                        {quiz.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 flex m-4 mt-0">
                    {quizData.length > 0 ? (
                        <Grid
                            container
                            spacing={2}
                        >
                            {/* Biểu đồ cột */}
                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <Paper
                                    elevation={3}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '8px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        align="center"
                                        gutterBottom
                                    >
                                        Thống kê số điểm kiểm tra
                                    </Typography>
                                    <div className="flex-1 flex items-end">
                                        <Chart data={quizData} />
                                    </div>
                                </Paper>
                            </Grid>

                            {/* Biểu đồ hình tròn */}
                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <Paper
                                    elevation={3}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '8px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        align="center"
                                        gutterBottom
                                    >
                                        Thống kê tổng số điểm kiểm tra đạt được
                                    </Typography>
                                    <div className="flex-1 flex items-center pb-3">
                                        <Pie1 data={quizData} />
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        <Box className="flex-1 flex justify-center items-center rounded-md bg-white shadow-lg">
                            <Typography
                                variant="body1"
                                align="center"
                                color="textSecondary"
                            >
                                Không có dữ liệu.
                            </Typography>
                        </Box>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
