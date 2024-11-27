'use client';
import { useRouter } from 'next/navigation';
import { useFilterData } from '~/context';
import { useCourses, useGrades, useTopics, useLessons } from '~/hooks';
import AdminAddQuestion from '~/app/admin/components/AddQuestion';
import { AnswerService, QuestionService } from '~/services';

function AdminAddPracticeQuestionPage() {
    const router = useRouter();
    const { filterData, resetFilterData } = useFilterData();

    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);
    const lessons = useLessons(filterData.topicId);

    const items = [
        {
            type: 'select',
            key: 'grade',
            label: 'Lớp',
            selected: filterData.grade,
            options: grades.map((grade) => ({ value: grade, label: 'Lớp ' + grade })),
        },
        {
            type: 'select',
            key: 'courseId',
            label: 'Môn học',
            selected: filterData.courseId,
            options: courses.map((course: any) => ({ value: course.id, label: course.name })),
            disabled: !filterData.grade,
        },
        {
            type: 'select',
            key: 'topicId',
            label: 'Chương mục',
            selected: filterData.topicId,
            options: topics.map((topic: any) => ({ value: topic.id, label: topic.name })),
            disabled: !filterData.courseId,
        },
        {
            type: 'select',
            key: 'lessonId',
            label: 'Bài học',
            selected: filterData.lessonId,
            options: lessons.map((lesson: any) => ({ value: lesson.id, label: lesson.name })),
            disabled: !filterData.topicId,
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
                    alert('Add question and answers successfully');
                    console.log('Add question and answers successfully');
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
