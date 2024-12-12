'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFilterData, useLoadingGlobal } from '~/app/admin/contexts';
import { CourseService, QuestionService, TopicService } from '~/services';
import AdminChooseQuestions from '~/app/admin/components/chooseQuestions';
import { MenuItem, Select } from '@mui/material';
import { useLessons } from '../../hooks';
import { toast } from 'react-toastify';

function AdminChooseQuizzesQuestion() {
    const [questionBank, setQuestionBank] = useState('quizzes');

    const router = useRouter();

    const { filterData, setFilterData } = useFilterData();
    const { setIsLoadingGlobal } = useLoadingGlobal();

    const lessons = useLessons(filterData.topicId);

    const [courseName, setCourseName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [questions, setQuestions] = useState<QuestionTypeWithSelection[]>([]);

    const fetchQuestionsQuiz = async () => {
        setIsLoadingGlobal(true);
        try {
            const questionsRes = await QuestionService.getQuestionsByTopic(
                true,
                filterData.topicId,
            );
            const { data, message } = questionsRes.data;
            if (data) {
                if (data.length > 0) {
                    setQuestions(data);
                    setIsLoadingGlobal(false);
                } else {
                    throw new Error('No questions found');
                }
            } else {
                throw new Error(message);
            }
        } catch (error) {
            setIsLoadingGlobal(false);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            setTimeout(() => {
                router.push('/admin/quizzes');
            }, 2000);
            console.error(error);
        }
    };

    const handleSelectValue = (key: string, value: string) => {
        if (key === 'questionBank') {
            setQuestionBank(value);
        } else {
            setFilterData({ [key]: value });
        }
    };

    const handleContinue = () => {
        router.push('/admin/quizzes/choose-questions/create');
    };

    useEffect(() => {
        if (!filterData.topicId) {
            router.push('/admin/quizzes');
        } else {
            const fetchFilterDisplay = async () => {
                const course = await CourseService.getCourseById(filterData.courseId);
                const topic = await TopicService.getTopicById(filterData.topicId);
                setCourseName(course.data.data.name);
                setTopicName(topic.data.data.name);
            };
            fetchFilterDisplay();
            fetchQuestionsQuiz();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterData.topicId]);

    useEffect(() => {
        if (questionBank === 'quizzes') {
            fetchQuestionsQuiz();
        } else {
            if (filterData.lessonId) {
                const fetchQuestionsPractice = async () => {
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
                fetchQuestionsPractice();
            } else {
                setQuestions([]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionBank, filterData.lessonId]);

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
    ];

    return (
        <AdminChooseQuestions
            filterDisplayItems={filterDisplayItems}
            questions={questions}
            extraFilterFields={
                <div className="w-full">
                    <div className="w-full flex flex-col gap-1 mb-3">
                        <label>Ngân hàng câu hỏi:</label>
                        <Select
                            value={questionBank}
                            size="small"
                            fullWidth
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={(e) => handleSelectValue('questionBank', e.target.value)}
                        >
                            <MenuItem value="practices">Câu hỏi thực hành</MenuItem>
                            <MenuItem value="quizzes">Câu hỏi kiểm tra</MenuItem>
                        </Select>
                    </div>
                    {questionBank === 'practices' && (
                        <div className="w-full flex flex-col gap-1 mb-3">
                            <label>Bài học:</label>
                            <Select
                                value={filterData.lessonId}
                                size="small"
                                fullWidth
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={(e) => handleSelectValue('lessonId', e.target.value)}
                            >
                                {lessons.map((lesson) => (
                                    <MenuItem
                                        key={lesson.id}
                                        value={lesson.id}
                                    >
                                        {lesson.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    )}
                </div>
            }
            onContinue={handleContinue}
        />
    );
}

export default AdminChooseQuizzesQuestion;
