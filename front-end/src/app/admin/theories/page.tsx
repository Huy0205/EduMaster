'use client';
import { Delete, Edit } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { TheoryService } from '~/services';
import AdminManagementWrapper from '../components/management';

function AdminTheoriesPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const fetchData = async (filters: any) => {
        if (filters.topicId) return await TheoryService.getTheoriesByTopic(filters.topicId);
        if (filters.courseId) return await TheoryService.getTheoriesByCourse(filters.courseId);
        if (filters.grade) return await TheoryService.getTheoriesByGrade(filters.grade);
        return await TheoryService.getAllTheories();
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
        header: ['STT', 'Tiêu đề', 'Link', 'Bài học', 'Chương mục', 'Môn học', 'Lớp'],
        columnsData: ['title', 'url', 'lessonName', 'topicName', 'courseName', 'grade'],
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

export default AdminTheoriesPage;
