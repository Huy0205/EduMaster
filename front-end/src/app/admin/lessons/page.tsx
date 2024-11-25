'use client';
import { Delete, Edit } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { LessonService } from '~/services';
import AdminManagementWrapper from '../components/management';

function AdminLessonsPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const fetchData = async (filters: any) => {
        if (filters.topicId) return await LessonService.getLessonsByTopic(filters.topicId);
        if (filters.courseId) return await LessonService.getLessonsByCourse(filters.courseId);
        if (filters.grade) return await LessonService.getLessonsByGrade(filters.grade);
        return await LessonService.getAllLessons();
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
        header: ['STT', 'Tên bài học', 'Chương mục', 'Môn học', 'Lớp', 'Trạng thái'],
        columnsData: ['name', 'topicName', 'courseName', 'grade', 'status'],
        actions: [
            { label: 'Sửa', icon: Edit, onClick: (item: any) => console.log('Edit', item) },
            { label: 'Xóa', icon: Delete, onClick: (item: any) => console.log('Delete', item) },
        ],
        addLink: '/admin/lessons/add',
    };

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            updateStatus={LessonService.updateStatus}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
        />
    );
}

export default AdminLessonsPage;
