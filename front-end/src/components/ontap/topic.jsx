import { Button, Paper, Typography, Box } from '@mui/material';
import React from 'react';
const Topic = ({ topicId, title, reviews, onSelectReview, selectedReviewId, setSelectedReviewId, isTopicOpen, setIsTopicOpen }) => {

    const toggleTopicOpen = () => {
      setIsTopicOpen(topicId, !isTopicOpen);
    };
    const handleSelectReview = (reviewId) => {
      setSelectedReviewId(reviewId);
      onSelectReview(reviewId, topicId);
    };
  
      return (
          <Paper
              elevation={2}
              sx={{ mb: 2, p: 1 }}
          >
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
                                  backgroundColor:
                                      selectedReviewId === review.id ? '#1e88e5' : 'white',
                              }}
                          >
                              <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 'bold' }}
                              >
                                  {review.name}
                              </Typography>
                          </Button>
                      ))}
                  </Box>
              )}
          </Paper>
      );
  };
export default Topic;