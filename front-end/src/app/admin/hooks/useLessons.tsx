'use client';
import { useEffect, useState } from 'react';
import { LessonService } from '~/services';

function useLessons(topicId: string) {
    const [lessons, setLessons] = useState<any[]>([]);

    useEffect(() => {
        if (topicId) {
            const fetchLessons = async () => {
                const result = await LessonService.getLessonsByTopic(topicId, 0);
                const { data, message } = result.data;
                if (data) {
                    setLessons(data);
                } else {
                    console.error(message);
                }
            };
            fetchLessons();
        } else {
            setLessons([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]);

    return lessons;
}

export default useLessons;
