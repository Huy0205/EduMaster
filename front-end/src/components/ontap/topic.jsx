'use client';
import { Button, Paper, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getApiNoneToken } from '~/api/page';
import { useOntapContext } from '~/context/OntapContext';

const Topic = ({ data, selected }) => {
    const { selectedTopic, setSelectedTopic, selectedLesson, setSelectedLesson } =
        useOntapContext();

    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetchLesson = async () => {
            if (selected) {
                try {
                    const lessonsResponse = await getApiNoneToken(`lesson/topic/${data.id}`);
                    const { data: lessonsData, message } = lessonsResponse.data;
                    if (lessonsData) {
                        setLessons(lessonsData);
                    } else {
                        throw new Error(message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchLesson();
    }, [data.id, selected]);

    const handleSelectTopic = () => {
        if (selectedTopic && selectedTopic.id === data.id) {
            setSelectedTopic(null);
        } else {
            setSelectedTopic(data);
        }
    };

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
    };

    return (
        <Paper
            elevation={2}
            className="mb-3 p-1"
        >
            <Button
                onClick={handleSelectTopic}
                fullWidth
                sx={{
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    backgroundColor: selected ? '#e3f2fd' : 'white',
                    color: selected ? '#1e88e5' : 'black',
                }}
            >
                <Typography variant="subtitle1">{data.name}</Typography>
                <Typography variant="subtitle1">{selected ? '▲' : '▼'}</Typography>
            </Button>

            {selected && (
                <Box sx={{ pl: 2, mt: 1 }}>
                    {lessons.map((lesson) => (
                        <Button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            fullWidth
                            sx={{
                                justifyContent: 'space-between',
                                textAlign: 'left',
                                mt: 1,
                                color: selectedLesson?.id === lesson.id ? 'white' : 'black',
                                backgroundColor:
                                    selectedLesson?.id === lesson.id ? '#1e88e5' : 'white',
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
