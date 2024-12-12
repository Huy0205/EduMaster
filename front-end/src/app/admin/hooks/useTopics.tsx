'use client';
import { useEffect, useState } from 'react';
import { TopicService } from '~/services';

function useTopics(courseId: string) {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        if (courseId) {
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
