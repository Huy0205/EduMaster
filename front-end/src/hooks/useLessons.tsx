'use client';
import { useEffect, useState } from 'react';
import { useFilterData } from '~/context';
import { LessonService } from '~/services';

function useLessons(topicId: string) {
    const [lessons, setLessons] = useState([]);

    const { setFilterData } = useFilterData();

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
            setFilterData({ lessonId: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]);

    return lessons;
}

export default useLessons;
