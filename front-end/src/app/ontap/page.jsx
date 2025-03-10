'use client';
import Header from '~/components/Header';
import React, { useState, useEffect } from 'react';
import Navbar from '~/components/Navbar';
import Topic from '~/components/ontap/topic';
import { Button, Paper, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getApiNoneToken, postApiNoneToken } from '~/api/page';
import { useOntapContext } from '~/context/OntapContext';
import { useAuth } from '~/context/AuthContext';

const OnTap = () => {
    const router = useRouter();

    const { auth, isLoadingAuth } = useAuth();

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const {
        selectedCourse,
        setSelectedCourse,
        selectedGrade,
        setSelectedGrade,
        selectedLectures,
        setSelectedLectures,
        questionPages,
        setQuestionPages,
        courses,
        setCourses,
        topics,
        setTopics,
        selectedLessonId,
        setSelectedLessonId,
        topicStates,
        setTopicStates,
        selectedTopicId,
        setSelectedTopicId,
    } = useOntapContext();

    const handleGradeChange = (e) => {
        setSelectedGrade(parseInt(e.target.value));
        setSelectedSubject([]);
        setSelectedLectures([]);
        setQuestionPages([]);
        setTopics([]);
        setSelectedReviewId(null);
        setTopicStates({});
        setSelectedTopicId(null);
    };

    useEffect(() => {
        if (!isLoadingAuth && !auth.user) {
            router.push('/login');
            return;
        }

        const fetchCourses = async () => {
            if (auth.user) {
                try {
                    const response = await getApiNoneToken(
                        `course/grade/${auth.user.currentGrade}`,
                    );
                    setCourses(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedCourse(response.data.data[0]);
                    }
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            }
        };
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingAuth, auth.user]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedCourse) {
                try {
                    const response = await getApiNoneToken(
                        `topic/course/${selectedCourse.id}?page=1&limit=100`,
                    );
                    const topicsData = response.data;
                    setTopics(topicsData.data);
                } catch (error) {
                    console.error('Error fetching topics:', error);
                }
            }
        };
        fetchTopics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourse]);

    const fetchLectures = async (reviewId) => {
        try {
            const response = await getApiNoneToken(`theory/lesson/${reviewId}`);
            const data = response.data;
            setSelectedLectures(data.data);
        } catch (error) {
            console.error('Error fetching lectures:', error);
        }
    };

    const fetchQuestions = async (reviewId) => {
        try {
            const response = await getApiNoneToken(`practice/lesson/${reviewId}`);
            const data = response.data;
            console.log(data);
            setQuestionPages(data.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handlePracticeQuestion = async (reviewId, page, topicId) => {
        const userId = auth.user.id;

        try {
            // Kiểm tra tiến trình hiện tại của người dùng
            const response = await getApiNoneToken(
                `practice-progress/user/${userId}/practice/${page.id}`,
            );
            const progress = response.data.data;

            if (progress) {
                // Nếu đã có tiến trình, chuyển hướng tới trang thực hành với `lastQuestionIndex` hiện tại
                console.log('Tiến trình đã tồn tại:', progress);
                router.push(
                    `/ontap/thuchanh?reviewId=${reviewId}&pargesId=${page.id}&topicId=${topicId}&userId=${userId}&bonusPoint=${page.bonusPoint}`,
                );
            } else {
                // Nếu chưa có tiến trình, tạo mới
                console.log('Chưa có tiến trình, tạo mới...');
                await postApiNoneToken('practice-progress/add', {
                    userId: userId,
                    practiceId: page.id,
                    lastQuestionIndex: 0,
                });

                // Chuyển hướng tới trang thực hành
                router.push(
                    `/ontap/thuchanh?reviewId=${reviewId}&pargesId=${page.id}&topicId=${topicId}&userId=${userId}&bonusPoint=${page.bonusPoint}`,
                );
            }
        } catch (error) {
            console.error('Error handling practice progress:', error);
        }
    };
    const handleViewLecture = (reviewId, lecture, topicId) => {
        const url = `/ontap/lythuyet?reviewId=${reviewId}&lectureId=${
            lecture.id
        }&lectureTitle=${encodeURIComponent(lecture.title)}&lectureUrl=${encodeURIComponent(
            lecture.url,
        )}&topicId=${topicId}`;
        router.push(url);
    };

    return (
        <Box className="w-screen h-screen flex flex-col bg-amber-50">
            <Header />
            <Navbar />
            {/* Course and Grade Selection Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    p: 2,
                }}
            >
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
                    {topics.length > 0 &&
                        topics.map((topic, index) => (
                            <Topic
                                key={index}
                                topicId={topic.id}
                                title={topic.name}
                                onSelectLesson={(reviewId, topicId) => {
                                    fetchLectures(reviewId);
                                    fetchQuestions(reviewId);
                                    console.log(`Selected Topic ID: ${topicId}`);
                                }}
                                selectedLessonId={selectedLessonId}
                                setSelectedLessonId={setSelectedLessonId}
                            />
                        ))}
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
                    {/* Theory Video Section */}
                    <Paper
                        className="flex-1 p-4 flex flex-col overflow-y-auto"
                        elevation={3}
                    >
                        <Typography
                            variant="h5"
                            className="font-bold mb-4"
                        >
                            Lý thuyết
                        </Typography>
                        {selectedLectures.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)', // 2 cột mỗi hàng
                                    gap: 2, // khoảng cách giữa các thẻ lecture
                                }}
                            >
                                {selectedLectures.map((lecture) => (
                                    <Paper
                                        key={lecture.id}
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
                                        {/* Lecture Image */}
                                        <Box
                                            component="img"
                                            src="/img/lecture.png" // Đường dẫn đến ảnh trong thư mục public
                                            alt="Lecture Image"
                                            sx={{
                                                width: '100%',
                                                height: '220px',
                                                borderRadius: 1,
                                            }}
                                        />
                                        {/* Lecture Title */}
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ mt: 2, fontWeight: 'bold' }}
                                        >
                                            {lecture.title}
                                        </Typography>
                                        {/* Action Button */}
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{
                                                mt: 1,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() =>
                                                handleViewLecture(
                                                    selectedReviewId,
                                                    lecture,
                                                    selectedTopicId,
                                                )
                                            }
                                        >
                                            Xem ngay
                                        </Button>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1"></Typography>
                        )}
                    </Paper>
                    {/* Practice Question Section */}
                    <Paper
                        className="flex-1 p-4 flex flex-col overflow-y-aut"
                        elevation={3}
                    >
                        <Typography
                            variant="h5"
                            className="font-bold mb-4"
                        >
                            Thực hành
                        </Typography>
                        {questionPages.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 2,
                                }}
                            >
                                {questionPages.map((page) => (
                                    <Paper
                                        key={page.id}
                                        sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}
                                    >
                                        <Box
                                            component="img"
                                            src="/img/question.jpg"
                                            alt="Question Image"
                                            sx={{
                                                width: '100%',
                                                height: '220px',
                                                borderRadius: 1,
                                            }}
                                        />
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ mt: 2, fontWeight: 'bold' }}
                                        >
                                            {page.name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mt: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() =>
                                                handlePracticeQuestion(
                                                    selectedReviewId,
                                                    page,
                                                    selectedTopicId,
                                                )
                                            }
                                        >
                                            Thực hành ngay
                                        </Button>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', color: 'red' }}
                            ></Typography>
                        )}
                    </Paper>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position the snackbar at the top center
                        sx={{
                            position: 'fixed', // Fixed position to keep it in the center
                            top: '50%', // Vertically center it
                            left: '50%', // Horizontally center it
                            transform: 'translate(-50%, -50%)', // Offset by half of width and height to center properly
                            width: '500px', // Set width to 500px
                            height: '300px', // Set height to 300px
                            zIndex: 9999, // Ensure it's on top of other elements
                        }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity="error"
                            sx={{ width: '100%' }}
                        >
                            Không có câu hỏi để thực hành.
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
};
export default OnTap;
