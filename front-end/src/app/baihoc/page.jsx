'use client'
import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, Typography, Select, MenuItem } from '@mui/material';
import ReactPlayer from 'react-player';
import Header from '~/components/Header';
import Navbar from '~/components/Navbar';

// Component hiển thị các topic với reviews và lectures
const Topic = ({ title, reviews, onSelectLecture, selectedLecture }) => {
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [openReviewId, setOpenReviewId] = useState(null);
  const [lectures, setLectures] = useState({}); 
  // Mở hoặc đóng topic
  const toggleTopicOpen = () => {
    setIsTopicOpen(!isTopicOpen);
  };

  // Mở hoặc đóng review
  const toggleReviewOpen = async (reviewId) => {
    setOpenReviewId(openReviewId === reviewId ? null : reviewId);
    if (openReviewId !== reviewId && !lectures[reviewId]) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/lecture/review/${reviewId}`);
        const data = await response.json();
        setLectures((prevLectures) => ({
          ...prevLectures,
          [reviewId]: data.data, // Lưu lectures vào state theo reviewId
        }));
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, p: 1 }}>
      {/* Button để mở topic */}
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

      {/* Nếu topic mở thì hiển thị danh sách review */}
      {isTopicOpen && (
        <Box sx={{ pl: 2, mt: 1 }}>
          {reviews.map((review) => (
            <Box key={review.id}>
              {/* Button để mở review */}
              <Button
                onClick={() => toggleReviewOpen(review.id)}  // Mở review và tải lectures
                fullWidth
                sx={{
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  backgroundColor: openReviewId === review.id ? '#f0f4c3' : 'white',
                  color: openReviewId === review.id ? '#827717' : 'black',
                  mt: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {review.name}
                </Typography>
                <Typography variant="subtitle2">{openReviewId === review.id ? '▲' : '▼'}</Typography>
              </Button>

              {/* Nếu review mở và lectures đã được tải */}
              {openReviewId === review.id && lectures[review.id] && (
                <Box sx={{ pl: 2, mt: 1 }}>
                  {lectures[review.id].map((lecture) => (
                    <Button
                      key={lecture.id}
                      onClick={() => onSelectLecture(lecture)}  // Gọi callback để chọn lecture
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        mt: 1,
                        backgroundColor: selectedLecture === lecture ? '#d1e7dd' : 'white',
                        color: selectedLecture === lecture ? '#155724' : 'black',
                        '&:hover': {
                          backgroundColor: selectedLecture === lecture ? '#c3e6cb' : '#e3f2fd',
                        },
                      }}
                    >
                      {lecture.title}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

// Component CourseLayout chính
const CourseLayout = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('Toán');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Fetch danh sách môn học theo lớp
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/course/grade/${selectedGrade}`);
        const data = await response.json();
        setCourses(data.data);
        if (data.data.length > 0) {
          setSelectedSubject(data.data[0]); // Set môn học đầu tiên làm mặc định
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [selectedGrade]);

  useEffect(() => {
    // Fetch danh sách topic theo môn học và các review bên trong topic
    const fetchTopics = async () => {
      if (selectedSubject) {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/topic/course/${selectedSubject.id}`);
          const topicsData = await response.json();

          // Lấy danh sách các review cho mỗi topic
          const topicsWithReviews = await Promise.all(
            topicsData.data.map(async (topic) => {
              const reviewResponse = await fetch(`http://localhost:8080/api/v1/review/topic/${topic.id}`);
              const reviewData = await reviewResponse.json();
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

  const handleSelectLecture = (lecture) => {
    setSelectedLecture(lecture);
    setSelectedVideo(lecture.url);
  };
  const handleNextLecture = async () => {
    if (!selectedLecture) return;
  
    let found = false;
  
    // Duyệt qua từng topic
    for (const topic of topics) {
      // Duyệt qua từng review trong topic
      for (const review of topic.reviews) {
        let lectureList = lectures[review.id] || []; // Lấy danh sách lectures từ state nếu đã có
  
        // Nếu lectures chưa được tải, gọi API để tải
        if (lectureList.length === 0) {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/lecture/review/${review.id}`);
            const data = await response.json();
            lectureList = data.data; // Cập nhật danh sách lectures
  
            // Cập nhật lectures vào state để lưu trữ
            setLectures((prevLectures) => ({
              ...prevLectures,
              [review.id]: lectureList,
            }));
          } catch (error) {
            console.error('Error fetching lectures:', error);
            return; // Dừng lại nếu có lỗi khi gọi API
          }
        }
  
        // Duyệt qua từng lecture trong review
        for (let i = 0; i < lectureList.length; i++) {
          if (lectureList[i].id === selectedLecture.id) {
            // Nếu lecture hiện tại không phải là cuối cùng trong review, chọn lecture tiếp theo
            if (i + 1 < lectureList.length) {
              handleSelectLecture(lectureList[i + 1]);
            } else {
              // Nếu lecture hiện tại là cuối cùng trong review, chuyển sang review tiếp theo
              const nextReviewIndex = topic.reviews.indexOf(review) + 1;
              if (nextReviewIndex < topic.reviews.length) {
                const nextReview = topic.reviews[nextReviewIndex];
  
                // Lấy danh sách lectures của review tiếp theo nếu chưa có trong state
                let nextLectureList = lectures[nextReview.id] || [];
                if (nextLectureList.length === 0) {
                  try {
                    const response = await fetch(`http://localhost:8080/api/v1/lecture/review/${nextReview.id}`);
                    const data = await response.json();
                    nextLectureList = data.data;
  
                    // Cập nhật lectures vào state
                    setLectures((prevLectures) => ({
                      ...prevLectures,
                      [nextReview.id]: nextLectureList,
                    }));
                  } catch (error) {
                    console.error('Error fetching lectures:', error);
                    return;
                  }
                }
  
                // Nếu review tiếp theo có lecture, chọn lecture đầu tiên
                if (nextLectureList.length > 0) {
                  handleSelectLecture(nextLectureList[0]);
                }
              }
            }
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }
  };
  

  if (!isClient) {
    return null;
  }

  return (
    <Box className="bg-gradient-to-r from-amber-50 to-white" sx={{ minHeight: '100vh' }}>
      <Header />
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
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
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={`/img/${course.name === 'Toán' ? 'icon_math_on.png' : 'icon_vietnamese_literature_on.png'}`}
                  alt={`${course.name} Icon`}
                  style={{ width: 40, height: 40 }}
                />
              </Box>
              <Typography variant="subtitle1">{course.name}</Typography>
            </Button>
          ))}
        </Box>

        <Select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
          sx={{ width: 100, position: 'relative', zIndex: 1 }}
        >
          <MenuItem value={1}>Lớp 1</MenuItem>
          <MenuItem value={2}>Lớp 2</MenuItem>
          <MenuItem value={3}>Lớp 3</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: 'flex', mt: 2 }}>
        <Paper sx={{ width: '25%', p: 2, height: 'calc(100vh - 200px)', overflowY: 'auto',
            backgroundImage: 'url(/img/bg-topic.jpg)', // Đường dẫn tới hình nền trong thư mục public/img
            backgroundSize: 'cover', // Để hình nền bao phủ toàn bộ Box
            backgroundPosition: 'center', // Căn giữa hình nền
         }} elevation={3}>
          {topics.map((topic, index) => (
            <Topic
              key={index}
              title={topic.name}
              reviews={topic.reviews}
              onSelectLecture={handleSelectLecture}
              selectedLecture={selectedLecture}
            />
          ))}
        </Paper>

        <Box sx={{ flex: 1, p: 2 }}>
          <Paper
            elevation={3}
            sx={{
              mb: 2,
              position: 'relative',
              width: '100%',
              height: 700,
              backgroundImage: selectedVideo ? 'none' : 'url(/img/bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <ReactPlayer url={selectedVideo} width="100%" height="100%" controls />
          </Paper>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedLecture?.title}
                </Typography>
                <Typography variant="body1">{selectedLecture?.description}</Typography>
              </Box>
              {/* <Button
                onClick={handleNextLecture}
                variant="contained"
                color="primary"
                sx={{ mt: 2, ml: 2 }}
              >
                Bài học tiếp theo
              </Button> */}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseLayout;
