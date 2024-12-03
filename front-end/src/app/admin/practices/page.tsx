'use client';
import { Delete, Edit, ViewList } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { PracticeService } from '~/services';
import AdminManagementWrapper from '../components/management';

function AdminPracticesPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const fetchData = async (filters: any) => {
        if (filters.lessonId)
            return await PracticeService.getPracticesByLesson(filters.lessonId, 0);
        if (filters.topicId) return await PracticeService.getPracticesByTopic(filters.topicId);
        if (filters.courseId) return await PracticeService.getPracticesByCourse(filters.courseId);
        if (filters.grade) return await PracticeService.getPracticesByGrade(filters.grade);
        return await PracticeService.getAllPractices();
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
        link: '/admin/practices/add',
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

export default AdminPracticesPage;
