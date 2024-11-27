'use client';
import { Delete, Edit } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { QuestionService } from '~/services';
import AdminManagementWrapper from '~/app/admin/components/management';

function AdminQuizQuestionsPage() {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const fetchData = async (filters: any) => {
        if (filters.topicId)
            return await QuestionService.getQuestionsByTopic(true, filters.topicId);
        if (filters.courseId)
            return await QuestionService.getQuestionsByCourse(true, filters.courseId);
        if (filters.grade) return await QuestionService.getQuestionsByGrade(true, filters.grade);
        return await QuestionService.getAllQuestions(true);
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
        header: ['STT', 'Nội dung', 'Chương mục', 'Môn học', 'Lớp', 'Trạng thái'],
        columnsData: ['content', 'topicName', 'courseName', 'grade', 'status'],
        actions: [
            { label: 'Sửa', icon: Edit, onClick: (item: any) => console.log('Edit', item) },
            { label: 'Xóa', icon: Delete, onClick: (item: any) => console.log('Delete', item) },
        ],
        addLink: '/admin/questions/quiz/add',
    };

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            updateStatus={QuestionService.updateStatus}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
        />
    );
}

export default AdminQuizQuestionsPage;
