'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFilterData } from '~/app/admin/contexts';
import { CourseService, LessonService, TopicService } from '~/services';
import FilterDisplay from '~/app/admin/components/filterDisplay';

function AdminChoosePracticeQuestion() {
    const router = useRouter();
    const { filterData } = useFilterData();
    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [lessonName, setLessonName] = useState('');

    useEffect(() => {
        if (!filterData.lessonId) {
            router.push('/admin/practices');
        } else {
            const fetchData = async () => {
                const course = await CourseService.getCourseById(filterData.courseId);
                const topic = await TopicService.getTopicById(filterData.topicId);
                const lesson = await LessonService.getLessonById(filterData.lessonId);
                setCourseName(course.data.data.name);
                setTopicName(topic.data.data.name);
                setLessonName(lesson.data.data.name);
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterData.lessonId]);

    const filterDisplayItems = [
        {
            key: 'grade',
            label: 'Lớp',
            value: `Lớp ${filterData.grade}`,
        },
        {
            key: 'courseId',
            label: 'Môn học',
            value: courseName,
        },
        {
            key: 'topicId',
            label: 'Chương mục',
            value: topicName,
        },
        {
            key: 'lessonId',
            label: 'Bài học',
            value: lessonName,
        },
    ];

    return (
        <div className="w-full flex bg-white py-5">
            <div className="max-w-[265px] flex flex-col items-center px-5 border-r-2 text-sm">
                <FilterDisplay items={filterDisplayItems} />
            </div>
            <div></div>
        </div>
    );
}

export default AdminChoosePracticeQuestion;
