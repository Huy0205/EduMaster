'use client';
import { Button, Paper, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { getApiNoneToken } from '~/api/page';

const Topic = ({ topicId, title, onSelectLesson, selectedLessonId, setSelectedLessonId }) => {
    const [lessons, setLessons] = useState([]);
    const [isTopicOpen, setIsTopicOpen] = useState(false);

    const toggleTopicOpen = async () => {
        setIsTopicOpen(topicId, !isTopicOpen);

        if (!isTopicOpen) {
            const lessonResponse = await getApiNoneToken(`lesson/topic/${topicId}`);
            const lessonData = lessonResponse.data;
            setLessons(lessonData.data);
        }
    };

    const handleSelectLesson = (lessonId) => {
        setSelectedLessonId(lessonId);
        onSelectLesson(lessonId, topicId);
    };

    return (
        <Paper
            elevation={2}
            className="mb-3 p-1"
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
                    {lessons.map((lesson) => (
                        <Button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            fullWidth
                            sx={{
                                justifyContent: 'space-between',
                                textAlign: 'left',
                                mt: 1,
                                color: selectedLessonId === lesson.id ? 'white' : 'black',
                                backgroundColor:
                                    selectedLessonId === lesson.id ? '#1e88e5' : 'white',
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}
                            >
                                {lesson.name}
                            </Typography>
                        </Button>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default Topic;
