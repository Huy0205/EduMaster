'use client';
import { useRouter } from 'next/navigation';
import { useFilterData } from '~/context';
import AdminAddQuestion from '~/app/admin/components/AddQuestion';
import { AnswerService, CourseService, QuestionService, TopicService } from '~/services';
import { useEffect, useState } from 'react';

function AdminAddQuizQuestionPage() {
    const router = useRouter();
    const { filterData, resetFilterData } = useFilterData();
    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');

    useEffect(() => {
        if (!filterData.topicId) {
            router.push('/admin/questions/quiz');
        } else {
            const fetchData = async () => {
                const course = await CourseService.getCourseById(filterData.courseId);
                const topic = await TopicService.getTopicById(filterData.topicId);
                setCourseName(course.data.data.name);
                setTopicName(topic.data.data.name);
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterData.topicId]);

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
    ];

    const handleAddQuizQuestion = async (FormData: any) => {
        const { answers, ...question } = FormData;
        try {
            const questionData = {
                ...question,
                topicId: filterData.topicId,
                lessonId: null,
            };
            const questionRes = await QuestionService.addQuestion(questionData);
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
                    router.push('/admin/questions/quiz');
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
            onSave={handleAddQuizQuestion}
        />
    );
}

export default AdminAddQuizQuestionPage;
