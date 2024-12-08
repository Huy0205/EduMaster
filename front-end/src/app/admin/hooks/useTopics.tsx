'use client';
import { useEffect, useState } from 'react';
import { useFilterData } from '../contexts';
import { TopicService } from '~/services';

function useTopics(courseId: string) {
    const [topics, setTopics] = useState([]);

    const { setFilterData } = useFilterData();

    useEffect(() => {
        if (courseId) {
            setFilterData({ topicId: '', lessonId: '' });
            const fetchTopics = async () => {
                const result = await TopicService.getTopicsByCourse(courseId, 0);
                const { data, message } = result.data;
                if (data) {
                    setTopics(data);
                } else {
                    console.error(message);
                }
            };
            fetchTopics();
        } else {
            setTopics([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    return topics;
}

export default useTopics;
