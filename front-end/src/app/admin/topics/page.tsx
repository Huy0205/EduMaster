'use client';
import { Delete, Edit } from '@mui/icons-material';

import { useCourses, useGrades } from '~/hooks';
import { useFilterData } from '~/context';
import { TopicService } from '~/services';
import AdminManagementWrapper from '../components/management';

function AdminTopicsPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);

    const fetchData = async (filters: any) => {
        if (filters.courseId) return await TopicService.getTopicsByCourse(filters.courseId, 0);
        if (filters.grade) return await TopicService.getTopicByGrade(filters.grade);
        return await TopicService.getAllTopics();
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
    ];

    const tableConfig = {
        header: ['STT', 'Tên chương mục', 'Môn học', 'Lớp'],
        columnsData: ['name', 'courseName', 'grade'],
        actions: [
            { label: 'Sửa', icon: Edit, onClick: (item: any) => console.log('Edit', item) },
            { label: 'Xóa', icon: Delete, onClick: (item: any) => console.log('Delete', item) },
        ],
        addLink: '/admin/topics/add',
    };

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
        />
    );
}

export default AdminTopicsPage;
