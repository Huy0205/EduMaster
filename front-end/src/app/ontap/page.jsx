'use client';
import Header from '~/components/Header';
import React, { useState, useEffect } from 'react';
import Navbar from '~/components/Navbar';
import { Button, Paper, Typography, Box, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
const Topic = ({ topicId, title, reviews, onSelectReview, selectedReviewId, setSelectedReviewId, isTopicOpen, setIsTopicOpen }) => {

  const toggleTopicOpen = () => {
    setIsTopicOpen(topicId, !isTopicOpen);
  };
  const handleSelectReview = (reviewId) => {
    setSelectedReviewId(reviewId);
    onSelectReview(reviewId, topicId);
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, p: 1 }}>
      <Button
        onClick={toggleTopicOpen}
        fullWidth
        sx={{
          justifyContent: 'space-between',
          textAlign: 'left',
          backgroundColor: isTopicOpen ? '#e3f2fd' : 'white',
          color: isTopicOpen ? '#1e88e5' : 'black',
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="subtitle1">{isTopicOpen ? '▲' : '▼'}</Typography>
      </Button>

      {isTopicOpen && (
        <Box sx={{ pl: 2, mt: 1 }}>
          {reviews.map((review) => (
            <Button
              key={review.id}
              onClick={() => handleSelectReview(review.id)}
              fullWidth
              sx={{
                justifyContent: 'space-between',
                textAlign: 'left',
                mt: 1,
                color: selectedReviewId === review.id ? 'white' : 'black',
                backgroundColor: selectedReviewId === review.id ? '#1e88e5' : 'white',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {review.name}
              </Typography>
            </Button>
          ))}
        </Box>
      )}
    </Paper>
  );
};

const OnTap = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedLectures, setSelectedLectures] = useState([]);
  const [questionPages, setQuestionPages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [topicStates, setTopicStates] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIsFirstLoad = searchParams.get('initialIsFirstLoad') === 'false';

  useEffect(() => {
    if (initialIsFirstLoad) {
      // Nếu là lần quay lại trang thì không reset
      const savedSelectedSubject = localStorage.getItem('selectedSubject');
      const savedSelectedGrade = localStorage.getItem('selectedGrade');
      const savedSelectedLectures = localStorage.getItem('selectedLectures');
      const savedTopics = localStorage.getItem('topics');
      const savedSelectedReviewId = localStorage.getItem('selectedReviewId');
      const savedQuestionPages = localStorage.getItem('questionPages');
      const savedTopicStates = JSON.parse(localStorage.getItem('topicStates')) || {};
      if (savedSelectedSubject) setSelectedSubject(JSON.parse(savedSelectedSubject));
      if (savedSelectedGrade) setSelectedGrade(Number(savedSelectedGrade));
      if (savedSelectedLectures) setSelectedLectures(JSON.parse(savedSelectedLectures));
      if (savedTopics) setTopics(JSON.parse(savedTopics));
      if (savedSelectedReviewId) setSelectedReviewId(JSON.parse(savedSelectedReviewId));
      if (savedQuestionPages) setQuestionPages(JSON.parse(savedQuestionPages));
      setTopicStates(savedTopicStates);
      console.log(localStorage.getItem('selectedSubject'));
    } else {
      // Nếu là lần tải lại trang, reset các state
      setSelectedSubject(null);
      setSelectedGrade(1);
      setSelectedLectures([]);
      setQuestionPages([]);
      setTopics([]);
      setSelectedReviewId(null);
      setTopicStates({});
      setIsFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSubject) localStorage.setItem('selectedSubject', JSON.stringify(selectedSubject));
    if (selectedGrade) localStorage.setItem('selectedGrade', selectedGrade.toString());
    if (selectedLectures.length) localStorage.setItem('selectedLectures', JSON.stringify(selectedLectures));
    if (topics.length) localStorage.setItem('topics', JSON.stringify(topics));
    if (selectedReviewId) localStorage.setItem('selectedReviewId', JSON.stringify(selectedReviewId));
    if (questionPages.length) localStorage.setItem('questionPages', JSON.stringify(questionPages));
  }, [selectedSubject, selectedGrade, selectedLectures, topics, selectedReviewId, questionPages]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/course/grade/${selectedGrade}`);
        const data = await response.json();
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
          const response = await fetch(`http://localhost:8080/api/v1/topic/course/${selectedSubject.id}?page=1&limit=100`,
            // {
            //   method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            //   role: 1,
            // }
            // }
          );
          const topicsData = await response.json();
          console.log(topicsData)
          const topicsWithReviews = await Promise.all(
            topicsData.data.list.map(async (topic) => {
              const reviewResponse = await fetch(`http://localhost:8080/api/v1/lesson/topic/${topic.id}`);
              const reviewData = await reviewResponse.json();
              return { ...topic, reviews: reviewData.data.list };
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
      localStorage.setItem('topicStates', JSON.stringify(updatedStates));
      if (isOpen) {
        setSelectedTopicId(topicId);
        localStorage.setItem('selectedTopicId', topicId);
      }
      return updatedStates;
    });
  };
  const fetchLectures = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/theory/lesson/${reviewId}`);
      const data = await response.json();
      setSelectedLectures(data.data);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const fetchQuestions = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/practice/lesson/${reviewId}`);
      const data = await response.json();
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
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage hoặc từ state

  
    // try {
      
    //   await axios.post('http://localhost:8080/api/v1/practice-progress/add', {
    //     userId: userId,
    //     practiceId: page.id,
    //     lastQuestionIndex: 0, 
    //   });
  
      // Sau khi thành công, chuyển hướng sang trang thực hành
      router.push(`/ontap/thuchanh?reviewId=${reviewId}&pargesId=${page.id}&topicId=${topicId}`);
    // } catch (error) {
    //   console.error('Error adding practice progress:', error);
    //   alert('Đã xảy ra lỗi khi bắt đầu bài thực hành. Vui lòng thử lại.');
    // }
  };
  

  const handleViewLecture = (reviewId, lecture, topicId) => {
    localStorage.setItem('isFirstLoad', 'false');
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
            onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
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
          <Paper className="p-4" sx={{marginRight:1}}>
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
