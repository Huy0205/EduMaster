'use client';
import Header from '~/components/Header';
import React, { useState, useEffect } from 'react';
import Navbar from '~/components/Navbar';
import { Button, Paper, Typography, Box, Select, MenuItem,Snackbar,Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

// Simplified Topic Component
const Topic = ({ title, reviews, onSelectReview,selectedReviewId,setSelectedReviewId}) => {
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  
  // Toggle the topic open or closed
  const toggleTopicOpen = () => {
    setIsTopicOpen(!isTopicOpen);
  };

  // Handle selecting a review
  const handleSelectReview = (reviewId) => {
    setSelectedReviewId(reviewId); // Cập nhật review đang chọn
    onSelectReview(reviewId); // Gọi hàm callback với reviewId mới
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
  const [selectedSubject, setSelectedSubject] = useState('Toán');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedLectures, setSelectedLectures] = useState([]);
  const [questionPages, setQuestionPages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();
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
          const response = await fetch(`http://localhost:8080/api/v1/topic/course/${selectedSubject.id}`);
          const topicsData = await response.json();

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

  const fetchLectures = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/lecture/review/${reviewId}`);
      const data = await response.json();
      console.log(data.data);
      setSelectedLectures(data.data); // Store the lectures in selectedLectures
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };
  const fetchQuestions = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/question/review/${reviewId}`);
      const data = await response.json();
      const questions = data.data.questions;
      console.log(questions);
      let pages = [];
      if (questions.length <= 5) {
        pages.push(questions);
      } else {
        let page1 = questions.slice(0, 5);
        let page2 = questions.slice(5);

        if (page2.length < 5) {
          pages.push([...page1, ...page2]);
        } else {
          pages.push(page1);
          pages.push(page2);
        }
      }

      setQuestionPages(pages);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handlePracticeQuestion = (reviewId, questionId) => {
    if (questionId === null || (Array.isArray(questionId) && questionId.length === 0)) {
      // Trigger the Snackbar with a custom message
      setOpenSnackbar(true);
    } else {
      const questionIdString = encodeURIComponent(JSON.stringify(questionId));
      // Proceed with navigation if questionId is valid
       router.push(`/ontap/thuchanh?reviewId=${reviewId}&questionId=${questionIdString}`);
    }
  };
  const handleViewLecture = (reviewId, lecture) => {
    // Xây dựng URL dạng chuỗi với query string
    const url = `/ontap/lythuyet?reviewId=${reviewId}&lectureId=${lecture.id}&lectureTitle=${encodeURIComponent(lecture.title)}&lectureUrl=${encodeURIComponent(lecture.url)}`;
  
    // Điều hướng đến URL mới
    router.push(url);
  };


  return (
    <Box className="min-h-screen bg-gradient-to-r from-amber-50 to-white">
      <Header />
      <Navbar />
      
      {/* Course and Grade Selection Section */}
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
        {/* Topics Sidebar */}
        <Paper sx={{ width: '25%', p: 2, height: 'calc(100vh - 200px)', overflowY: 'auto',
            backgroundImage: 'url(/img/bg-topic.jpg)', // Đường dẫn tới hình nền trong thư mục public/img
            backgroundSize: 'cover', // Để hình nền bao phủ toàn bộ Box
            backgroundPosition: 'center', // Căn giữa hình nền
         }} elevation={3}>
          {topics.map((topic, index) => (
            <Topic key={index} title={topic.name} reviews={topic.reviews} onSelectReview={(reviewId) => { fetchLectures(reviewId); fetchQuestions(reviewId); }}  selectedReviewId={selectedReviewId} setSelectedReviewId={setSelectedReviewId}  />
          ))}
        </Paper>

        {/* Main Content */}
        <Box component="main" flex={1} p={4} display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
          {/* Theory Video Section */}
          <Paper className="p-4" sx={{
              backgroundImage: 'url(/img/bg.jpg)', // Đường dẫn tới hình nền trong thư mục public/img
              backgroundSize: 'cover', // Để hình nền bao phủ toàn bộ Box
              backgroundPosition: 'center', // Căn giữa hình nền
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
                   onClick={() => handleViewLecture(selectedReviewId, lecture)}
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
           <Paper className="p-4" sx={{ backgroundImage: 'url(/img/bg-thwebp.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <Typography variant="h5" className="font-bold mb-4">Thực hành</Typography>
              
              {questionPages.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  {questionPages.map((page, index) => (
                    <Paper key={index} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                      <Box
                        component="img"
                        src="/img/question.jpg"
                        alt="Question Image"
                        sx={{ width: '100%', height: '220px', borderRadius: 1 }}
                      />
                      <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Bài {index + 1}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                        onClick={() => handlePracticeQuestion(selectedReviewId, page)}
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
