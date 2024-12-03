'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFilterData } from '~/context';
import {
    AnswerService,
    CourseService,
    LessonService,
    QuestionService,
    TopicService,
} from '~/services';
import AdminAddQuestion from '~/app/admin/components/AddQuestion';

function AdminAddPracticeQuestionPage() {
    const router = useRouter();
    const { filterData, resetFilterData } = useFilterData();
    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [lessonName, setLessonName] = useState('');

    useEffect(() => {
        if (!filterData.lessonId) {
            router.push('/admin/questions/practice');
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

    const items = [
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

    const handleAddPracticeQuestion = async (FormData: any) => {
        const { answers, ...question } = FormData;
        try {
            const questionData = {
                ...question,
                topicId: filterData.topicId,
                lessonId: filterData.lessonId,
            };
            const questionRes = await QuestionService.addQuestion(questionData);
            console.log(questionRes);
            const { data, message } = questionRes.data;
            if (data) {
                const questionId = data.id;
                const answerData = answers.map((answer: any) => ({
                    ...answer,
                    questionId,
                }));
                const answerRes = await AnswerService.addAnswers(answerData);
                const { data: answerDataRes, message: answerMessageRes } = answerRes.data;
                if (answerDataRes) {
                    alert('Thêm câu hỏi và câu trả lời thành công');
                    resetFilterData();
                    router.push('/admin/questions/practice');
                } else {
                    console.log(answerMessageRes);
                }
            } else {
                console.log(message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AdminAddQuestion
            items={items}
            onSave={handleAddPracticeQuestion}
        />
    );
}

export default AdminAddPracticeQuestionPage;
