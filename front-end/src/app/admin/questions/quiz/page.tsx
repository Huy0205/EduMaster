'use client';
import { Delete, Edit, ViewList } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/app/admin/hooks';
import { useFilterData } from '~/app/admin/contexts';
import { QuestionService } from '~/services';
import AdminManagementWrapper from '~/app/admin/components/management';
import {
    createCourseFilter,
    createGradeFilter,
    createTopicFilter,
} from '~/app/admin/configs/filters';

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
        createGradeFilter(grades),
        createCourseFilter(courses, filterData.grade),
        createTopicFilter(topics, filterData.courseId),
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
        ] as ColumnConfig[],
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
        link: '/admin/questions/quiz/add',
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

export default AdminQuizQuestionsPage;
