'use client';
import { useEffect, useState } from 'react';
import { TopicService } from '~/services';

function useTopics(courseId: string) {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        if (courseId) {
            setTopics([]);
            const fetchTopics = async () => {
                if (!courseId) return;
                const result = await TopicService.getTopicsByCourse(courseId, 0);
                const { data, message } = result.data;
                if (data) {
                    setTopics(data);
                } else {
                    console.error(message);
                }
            };
            fetchTopics();
        }
    }, [courseId]);

    return topics;
}

export default useTopics;
