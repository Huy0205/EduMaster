'use client';
import Header from '~/components/Header';
import React, { useState, useEffect } from 'react';
import Navbar from '~/components/Navbar';
import Topic from '~/components/ontap/topic';
import { Button, Paper, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getApiNoneToken } from '~/api/page';
import { useOntapContext } from '~/context/OntapContext';
import { useAuth } from '~/context/AuthContext';
import Image from 'next/image';

const OnTap = () => {
    const router = useRouter();

    const { auth, isLoadingAuth } = useAuth();
    const {
        selectedCourse,
        setSelectedCourse,
        selectedTopic,
        selectedLesson,
        setSelectedTheory,
        setSelectedPractice,
        setFirstPracticeInLesson,
    } = useOntapContext();

    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [theories, setTheories] = useState([]);
    const [practices, setPractices] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
                    const coursesData = response.data.data;
                    setCourses(coursesData);
                    if (
                        response.data.data.length > 0 &&
                        !coursesData.some((course) => course.id === selectedCourse?.id)
                    ) {
                        setSelectedCourse(coursesData[0]);
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
                    const response = await getApiNoneToken(`topic/course/${selectedCourse.id}`);
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

    useEffect(() => {
        const fetchTheoriesAndPractices = async () => {
            if (selectedLesson) {
                try {
                    const [theoriesRes, practicesRes] = await Promise.all([
                        getApiNoneToken(`theory/lesson/${selectedLesson.id}`),
                        getApiNoneToken(`practice/lesson/${selectedLesson.id}`),
                    ]);

                    const { data: theoriesData, message: theoriesMessage } = theoriesRes.data;
                    if (theoriesData) {
                        setTheories(theoriesData);
                    } else {
                        throw new Error(theoriesMessage);
                    }

                    const { data: practicesData, message: practicesMessage } = practicesRes.data;
                    if (practicesData) {
                        setPractices(practicesData);
                        setFirstPracticeInLesson(practicesData[0]);
                    } else {
                        throw new Error(practicesMessage);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchTheoriesAndPractices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLesson]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleShowPractice = async (practice) => {
        setSelectedPractice(practice);
        router.push('/ontap/thuchanh');
    };

    const handleViewTheory = (theory) => {
        setSelectedTheory(theory);
        router.push('/ontap/lythuyet');
    };

    console.log('courses', courses);

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
                        courses.map((course) => (
                            <Button
                                key={course.id}
                                variant={selectedCourse.id === course.id ? 'contained' : 'outlined'}
                                onClick={() => setSelectedCourse(course)}
                                sx={{
                                    width: 180,
                                    height: 100,
                                    flexDirection: 'column',
                                    color:
                                        selectedCourse.id === course.id ? 'white' : 'primary.main',
                                    bgcolor:
                                        selectedCourse.id === course.id ? 'primary.main' : 'white',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        src={`/img/${
                                            course.name === 'Toán'
                                                ? 'icon_math_on.png'
                                                : 'icon_vietnamese_literature_on.png'
                                        }`}
                                        alt={`${course.name} Icon`}
                                        width={40}
                                        height={40}
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
                                data={topic}
                                selected={topic.id === selectedTopic?.id}
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
                        {theories.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 2,
                                }}
                            >
                                {theories.map((theory) => (
                                    <Paper
                                        key={theory.id}
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
                                            src="/img/lecture.png"
                                            alt="Lecture Image"
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
                                            {theory.title}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{
                                                mt: 1,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() => handleViewTheory(theory)}
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
                        className="flex-1 p-4 flex flex-col overflow-y-auto"
                        elevation={3}
                    >
                        <Typography
                            variant="h5"
                            className="font-bold mb-4"
                        >
                            Thực hành
                        </Typography>
                        {practices.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 2,
                                }}
                            >
                                {practices.map((practice) => (
                                    <Paper
                                        key={practice.id}
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
                                            {practice.name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mt: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() => handleShowPractice(practice)}
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
