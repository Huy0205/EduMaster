'use client';
import { useEffect, useState } from 'react';
import { CourseService } from '~/services';

function useCourses(grade: number) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (grade) {
            const fetchCourses = async () => {
                const result = await CourseService.getCoursesByGrade(grade);
                const { data, message } = result.data;
                if (data) {
                    setCourses(data);
                } else {
                    console.error(message);
                }
            };
            fetchCourses();
        } else {
            setCourses([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grade]);

    return courses;
}

export default useCourses;
