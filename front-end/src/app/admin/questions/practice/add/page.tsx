'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFilterData } from '~/app/admin/contexts';
import {
    AnswerService,
    CourseService,
    LessonService,
    QuestionService,
    TopicService,
    UploadService,
} from '~/services';
import AdminAddQuestion from '~/app/admin/components/addQuestion';
import { toast } from 'react-toastify';
import { useLoadingGlobal } from '~/app/admin/contexts/loadingGlobalContext';

function AdminAddPracticeQuestionPage() {
    const router = useRouter();
    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [lessonName, setLessonName] = useState('');

    const { filterData } = useFilterData();
    const { setIsLoadingGlobal } = useLoadingGlobal();

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

    const handleAddPracticeQuestion = async (FormData: FormDataAddQuestion) => {
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
                    lessonId: filterData.lessonId,
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
                        router.push('/admin/questions/practice');
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
            onSave={handleAddPracticeQuestion}
        />
    );
}

export default AdminAddPracticeQuestionPage;
