'use client';
import { Delete, Edit } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import useLessons from '~/hooks/useLessons';
import { QuestionService } from '~/services';
import AdminManagementWrapper from '~/app/admin/components/management';

function AdminPracticeQuestionsPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);
    const lessons = useLessons(filterData.topicId);

    const fetchData = async (filters: any) => {
        if (filters.topicId) return await QuestionService.getQuestionsByTopic(filters.topicId);
        if (filters.courseId) return await QuestionService.getQuestionsByCourse(filters.courseId);
        if (filters.grade) return await QuestionService.getQuestionsByGrade(filters.grade);
        return await QuestionService.getAllQuestions();
    };

    const filterConfig = [
        {
            key: 'grade',
            placeholder: 'Chọn lớp',
            options: grades.map((grade) => ({ value: grade, label: 'Lớp ' + grade })),
        },
        {
            key: 'courseId',
            placeholder: 'Chọn môn học',
            options: courses.map((course: any) => ({ value: course.id, label: course.name })),
            disabled: !filterData.grade,
            tooltipTitle: 'Vui lòng chọn lớp trước',
        },
        {
            key: 'topicId',
            placeholder: 'Chọn chương mục',
            options: topics.map((topic: any) => ({ value: topic.id, label: topic.name })),
            disabled: !filterData.courseId,
            tooltipTitle: 'Vui lòng chọn môn học trước',
        },
        {
            key: 'lessonId',
            placeholder: 'Chọn bài học',
            options: lessons.map((lesson: any) => ({ value: lesson.id, label: lesson.name })),
            disabled: !filterData.topicId,
            tooltipTitle: 'Vui lòng chọn chương mục trước',
        },
    ];

    const tableConfig = {
        header: ['STT', 'Nội dung', 'Bài học', 'Chương mục', 'Môn học', 'Lớp'],
        columnsData: ['content', 'lessonName', 'topicName', 'courseName', 'grade'],
        actions: [
            { label: 'Sửa', icon: Edit, onClick: (item: any) => console.log('Edit', item) },
            { label: 'Xóa', icon: Delete, onClick: (item: any) => console.log('Delete', item) },
        ],
        addLink: '/admin/questions/practice/add',
    };

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
        />
    );
}

export default AdminPracticeQuestionsPage;
