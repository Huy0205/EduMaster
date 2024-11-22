'use client';
import { useEffect, useState } from 'react';
import { CourseService } from '~/services';

function useCourses(grade: number) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (grade) {
            setCourses([]);
            const fetchCourses = async () => {
                if (grade === 0) {
                    return;
                }
                const result = await CourseService.getCoursesByGrade(grade);
                const { data, message } = result.data;
                if (data) {
                    setCourses(data);
                } else {
                    console.error(message);
                }
            };
            fetchCourses();
        }
    }, [grade]);

    return courses;
}

export default useCourses;