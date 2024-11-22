'use client';
import { useEffect, useState } from 'react';
import { LessonService } from '~/services';

function useLessons(topicId: string) {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        if (topicId) {
            setLessons([]);
            const fetchLessons = async () => {
                if (!topicId) return;
                const result = await LessonService.getLessonsByTopic(topicId);
                const { data, message } = result.data;
                if (data) {
                    setLessons(data);
                } else {
                    console.error(message);
                }
            };
            fetchLessons();
        }
    }, [topicId]);

    return lessons;
}

export default useLessons;
