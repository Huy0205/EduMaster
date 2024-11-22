'use client';
import { useEffect, useState } from 'react';
import { CourseService } from '~/services';

function useGrades() {
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const fetchGrades = async () => {
            const result = await CourseService.getGradeDistinct();
            const { data, message } = result.data;
            if (data) {
                setGrades(data);
            } else {
                console.error(message);
            }
        };
        fetchGrades();
    }, []);

    return grades;
}

export default useGrades;
