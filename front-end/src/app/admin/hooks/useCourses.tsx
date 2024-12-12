'use client';
import { useEffect, useState } from 'react';
import { useFilterData } from '../contexts';
import { CourseService } from '~/services';

function useCourses(grade: number) {
    const [courses, setCourses] = useState([]);

    const { filterData, setFilterData } = useFilterData();

    useEffect(() => {
        if (grade) {
            if (filterData.grade !== grade) {
                setFilterData({ courseId: '', topicId: '', lessonId: '' });
            }
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
