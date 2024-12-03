'use client';
import { Delete, Edit, ViewList } from '@mui/icons-material';

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
        if (filters.lessonId)
            return await QuestionService.getQuestionsByLesson(filters.lessonId, 0);
        if (filters.topicId)
            return await QuestionService.getQuestionsByTopic(false, filters.topicId);
        if (filters.courseId)
            return await QuestionService.getQuestionsByCourse(false, filters.courseId);
        if (filters.grade) return await QuestionService.getQuestionsByGrade(false, filters.grade);
        return await QuestionService.getAllQuestions(false);
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
        columns: [
            {
                key: 'content',
                label: 'Nội dung',
                width: 'auto',
                align: 'left',
            },
            {
                key: 'type',
                label: 'Loại',
                width: '200px',
                align: 'left',
            },
        ],
        actions: [
            {
                label: 'Sửa',
                icon: Edit,
                color: 'blue',
                onClick: (item: any) => console.log('Edit', item),
            },
            {
                label: 'Xóa',
                icon: Delete,
                color: 'red',
                onClick: (item: any) => console.log('Delete', item),
            },
            {
                label: 'Xem chi tiết',
                icon: ViewList,
                color: 'green',
                onClick: (item: any) => console.log('Detail', item),
            },
        ],
    };

    const addBtn = {
        link: '/admin/questions/practice/add',
        disabled: !filterData.lessonId,
    };

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
            addBtn={addBtn}
        />
    );
}

export default AdminPracticeQuestionsPage;
