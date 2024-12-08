'use client';
import Header from '~/components/Header';
import React, { useState, useEffect } from 'react';
import Navbar from '~/components/Navbar';
import Topic from '~/components/ontap/topic'
import { Button, Paper, Typography, Box, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getApiNoneToken, postApiNoneToken } from '~/api/page';
import { useOntapContext } from '~/context/OntapContext';
const OnTap = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const {
        selectedSubject,
        setSelectedSubject,
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
        selectedReviewId,
        setSelectedReviewId,
        topicStates,
        setTopicStates,
        selectedTopicId,
        setSelectedTopicId,
    } = useOntapContext();
    useEffect(() => {
        setIsClient(true);
        console.log(isClient);
    }, []);

    const handleGradeChange = (e) => {
        setSelectedGrade(parseInt(e.target.value))
        setSelectedSubject(null);
        setSelectedLectures([]);
        setQuestionPages([]);
        setTopics([]);
        setSelectedReviewId(null);
        setTopicStates({});
        setSelectedTopicId(null);
      };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getApiNoneToken(`course/grade/${selectedGrade}`);
                setCourses(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedSubject(response.data.data[0]);
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
                    const response = await getApiNoneToken(`topic/course/${selectedSubject.id}?page=1&limit=100`,
                        // {
                        //   method: 'GET',
                        // headers: {
                        //   'Content-Type': 'application/json',
                        //   role: 1,
                        // }
                        // }
                    );
                    const topicsData = response.data;
                    console.log(topicsData)
                    const topicsWithReviews = await Promise.all(
                        topicsData.data.map(async (topic) => {
                            const reviewResponse = await getApiNoneToken(`lesson/topic/${topic.id}`);
                            const reviewData = reviewResponse.data;
                            return { ...topic, reviews: reviewData.data };
                        })
                    );

                    setTopics(topicsWithReviews);
                } catch (error) {
                    console.error('Error fetching topics:', error);
                }
            }
        };
        fetchTopics();
    }, [selectedSubject]);
    const setIsTopicOpen = (topicId, isOpen) => {
        setTopicStates((prevState) => {
            const updatedStates = { ...prevState, [topicId]: isOpen };         
            if (isOpen) {
                setSelectedTopicId(topicId);              
            }
            return updatedStates;
        });
    };
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
            console.log(data)
            setQuestionPages(data.data)
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handlePracticeQuestion = async (reviewId, page, topicId) => {
        const userId = localStorage.getItem('userId');

        try {
            // Kiểm tra tiến trình hiện tại của người dùng
            const response = await getApiNoneToken(`practice-progress/user/${userId}/practice/${page.id}`);
            const progress = response.data.data;

            if (progress) {
                // Nếu đã có tiến trình, chuyển hướng tới trang thực hành với `lastQuestionIndex` hiện tại
                console.log('Tiến trình đã tồn tại:', progress);
                router.push(`/ontap/thuchanh?reviewId=${reviewId}&pargesId=${page.id}&topicId=${topicId}&userId=${userId}`);
            } else {
                // Nếu chưa có tiến trình, tạo mới
                console.log('Chưa có tiến trình, tạo mới...');
                await postApiNoneToken('practice-progress/add', {
                    userId: userId,
                    practiceId: page.id,
                    lastQuestionIndex: 0,
                });

                // Chuyển hướng tới trang thực hành
                router.push(`/ontap/thuchanh?reviewId=${reviewId}&pargesId=${page.id}&topicId=${topicId}&userId=${userId}`);
            }
        } catch (error) {
            console.error('Error handling practice progress:', error);
        }
    };
    const handleViewLecture = (reviewId, lecture, topicId) => {
        const url = `/ontap/lythuyet?reviewId=${reviewId}&lectureId=${lecture.id}&lectureTitle=${encodeURIComponent(lecture.title)}&lectureUrl=${encodeURIComponent(lecture.url)}&topicId=${topicId}`;
        router.push(url);
    };

    return (
        <Box className="min-h-screen bg-gradient-to-r from-amber-50 to-white">
            <Header />
            <Navbar />

            {/* Course and Grade Selection Section */}
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
                        onChange={handleGradeChange}
                        sx={{
                            width: 150,
                            height: 40,
                            ml: 20, // Tạo khoảng cách giữa các nút và phần chọn lớp
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
                    width: '25%', p: 2, height: 'calc(90vh - 200px)', overflowY: 'auto',
                    backgroundImage: 'url(/img/bg-topic.jpg)', // Đường dẫn tới hình nền trong thư mục public/img
                    backgroundSize: 'cover', // Để hình nền bao phủ toàn bộ Box
                    backgroundPosition: 'center', // Căn giữa hình nền
                    marginLeft: 1
                }} elevation={3}>
                    {topics.map((topic, index) => (
                        <Topic
                            key={index}
                            topicId={topic.id}
                            title={topic.name}
                            reviews={topic.reviews}
                            onSelectReview={(reviewId, topicId) => { fetchLectures(reviewId); fetchQuestions(reviewId); console.log(`Selected Topic ID: ${topicId}`); }}
                            selectedReviewId={selectedReviewId}
                            setSelectedReviewId={setSelectedReviewId}
                            isTopicOpen={topicStates[topic.id] || false}
                            setIsTopicOpen={setIsTopicOpen}
                        />
                    ))}
                </Paper>

                {/* Main Content */}
                <Box component="main" flex={1} marginLeft={4} display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
                    {/* Theory Video Section */}
                    <Paper className="p-4" sx={{
                         overflowY: 'auto',
                         height: 'calc(90vh - 200px)'
                    }}>
                        <Typography variant="h5" className="font-bold mb-4">Lý thuyết</Typography>
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
                                            sx={{ width: '100%', height: '220px', borderRadius: 1 }}
                                        />

                                        {/* Lecture Title */}
                                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                            {lecture.title}
                                        </Typography>

                                        {/* Action Button */}
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}
                                            onClick={() => handleViewLecture(selectedReviewId, lecture, selectedTopicId)}
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
                    <Paper className="p-4" sx={{ marginRight: 1, overflowY: 'auto',height: 'calc(90vh - 200px)' }}>
                        <Typography variant="h5" className="font-bold mb-4">Thực hành</Typography>

                        {questionPages.length > 0 ? (
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                {questionPages.map((page) => (
                                    <Paper key={page.id} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                        <Box
                                            component="img"
                                            src="/img/question.jpg"
                                            alt="Question Image"
                                            sx={{ width: '100%', height: '220px', borderRadius: 1 }}
                                        />
                                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                            {page.name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                                            onClick={() => handlePracticeQuestion(selectedReviewId, page, selectedTopicId)}
                                        >
                                            Thực hành ngay
                                        </Button>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'red' }}>
                            </Typography>
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
                        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                            Không có câu hỏi để thực hành.
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
};
export default OnTap;
