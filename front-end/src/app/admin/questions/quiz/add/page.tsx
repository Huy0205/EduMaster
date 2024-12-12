'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFilterData } from '~/app/admin/contexts';
import { useLoadingGlobal } from '~/app/admin/contexts/loadingGlobalContext';
import {
    AnswerService,
    CourseService,
    QuestionService,
    TopicService,
    UploadService,
} from '~/services';
import AdminAddQuestion from '~/app/admin/components/addQuestion';
import { toast } from 'react-toastify';

function AdminAddQuizQuestionPage() {
    const router = useRouter();
    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');

    const { filterData } = useFilterData();
    const { setIsLoadingGlobal } = useLoadingGlobal();

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
            setIsLoadingGlobal(true);
            fetchData();
            setIsLoadingGlobal(false);
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

    const handleAddQuizQuestion = async (FormData: FormDataAddQuestion) => {
        setIsLoadingGlobal(true);
        const { answers, file, ...question } = FormData;
        try {
            const uploadRes = await UploadService.uploadQuestionImage(file);
            const { data: uploadData, message: uploadMessage } = uploadRes.data;
            if (uploadData) {
                question.image = uploadData.fileUrl;
                const questionRes = await QuestionService.addQuestion({
                    ...question,
                    topicId: filterData.topicId,
                    lessonId: null,
                });
                const { data: questionData, message: questionMessage } = questionRes.data;
                if (questionData) {
                    const questionId = questionData.id;
                    const answerData = answers.map((answer: any) => ({
                        ...answer,
                        question: {
                            id: questionId,
                        },
                    }));
                    const answerRes = await AnswerService.addAnswers(answerData);
                    const { data: answerDataRes, message: answerMessageRes } = answerRes.data;
                    if (answerDataRes) {
                        setIsLoadingGlobal(false);
                        toast.success('Thêm câu hỏi thành công');
                        router.push('/admin/questions/quiz');
                    } else {
                        throw new Error(answerMessageRes);
                    }
                } else {
                    throw new Error(questionMessage);
                }
            } else {
                throw new Error(uploadMessage);
            }
        } catch (error) {
            setIsLoadingGlobal(false);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            setTimeout(() => {
                router.push('/admin/questions/practice');
            }, 3000);
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
