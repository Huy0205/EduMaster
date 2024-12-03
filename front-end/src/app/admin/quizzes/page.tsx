'use client';
import { Delete, Edit, ViewList } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { QuizService } from '~/services';
import AdminManagementWrapper from '../components/management';

function AdminQuizzesPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const fetchData = async (filters: any) => {
        if (filters.topicId) return await QuizService.getQuizByTopic(filters.topicId, 0);
        if (filters.courseId) return await QuizService.getQuizByCourse(filters.courseId);
        if (filters.grade) return await QuizService.getQuizByGrade(filters.grade);
        return await QuizService.getAllQuizzes();
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
    ];

    const tableConfig = {
        columns: [
            {
                key: 'name',
                label: 'Tên thực hành',
                width: 'auto',
                align: 'left',
            },
            {
                key: 'time',
                label: 'Thời gian',
                width: '200px',
                align: 'center',
            },
            {
                key: 'bonusPoint',
                label: 'Điểm thưởng',
                width: '200px',
                align: 'center',
            },
            {
                key: 'status',
                label: 'Trạng thái',
                width: '200px',
                align: 'center',
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
        link: '/admin/quizzes/add',
        disabled: !filterData.topicId,
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

export default AdminQuizzesPage;
