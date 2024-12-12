'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFilterData, useQuestionsSelected } from '~/app/admin/contexts';
import { CourseService, LessonService, QuestionService, TopicService } from '~/services';
import { toast } from 'react-toastify';
import AdminChooseQuestions from '../../components/chooseQuestions';

function AdminChoosePracticeQuestion() {
    const router = useRouter();
    const { filterData } = useFilterData();
    const { questionsSelected } = useQuestionsSelected();

    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [lessonName, setLessonName] = useState('');
    const [questions, setQuestions] = useState<QuestionTypeWithSelection[]>([]);

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

                const questionsRes = await QuestionService.getQuestionsByLesson(
                    filterData.lessonId,
                );
                const { data, message } = questionsRes.data;
                if (data) {
                    if (data.length > 0) {
                        setQuestions(data);
                    } else {
                        console.error('No questions found');
                    }
                } else {
                    console.error(message);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterData.lessonId]);

    const handleContinue = () => {
        if (questionsSelected.length === 0) {
            toast.warning('Vui lòng chọn câu hỏi');
            return;
        }
        router.push('/admin/practices/choose-questions/create');
    };

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
        <AdminChooseQuestions
            filterDisplayItems={filterDisplayItems}
            questions={questions}
            onContinue={handleContinue}
        />
    );
}

export default AdminChoosePracticeQuestion;
