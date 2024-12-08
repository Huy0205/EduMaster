'use client';
import { useState } from 'react';
import { Close, Delete, Edit, HelpOutline, ViewList } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import { useCourses, useGrades, useTopics } from '~/app/admin/hooks';
import { useFilterData } from '~/app/admin/contexts';
import useLessons from '~/app/admin/hooks/useLessons';
import { QuestionService } from '~/services';
import AdminManagementWrapper from '~/app/admin/components/management';
import {
    createCourseFilter,
    createGradeFilter,
    createLessonFilter,
    createTopicFilter,
} from '~/app/admin/configs/filters';
import QuestionView from '../../components/questionView';

function AdminPracticeQuestionsPage() {
    const [showDetail, setShowDetail] = useState(false);
    const [dataSelected, setDataSelected] = useState<any>(null);

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

    const handleShowDetail = (data: any) => {
        setDataSelected(data);
        setShowDetail(true);
    };

    const filterConfig = [
        createGradeFilter(grades),
        createCourseFilter(courses, filterData.grade),
        createTopicFilter(topics, filterData.courseId),
        createLessonFilter(lessons, filterData.topicId),
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
                onClick: (item: any) => handleShowDetail(item),
            },
        ],
    };

    const addBtn = {
        link: '/admin/questions/practice/add',
        disabled: !filterData.lessonId,
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                filterConfig={filterConfig}
                tableConfig={tableConfig}
                addBtn={addBtn}
            />
            <Dialog
                open={showDetail}
                onClose={() => setShowDetail(false)}
                // sx={{ '& .MuiDialog-paper': { width: '60%', maxWidth: 'none' } }}
            >
                <DialogTitle
                    sx={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        // padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <HelpOutline />
                        <h2>Chi tiết câu hỏi</h2>
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowDetail(false)}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <QuestionView data={dataSelected} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AdminPracticeQuestionsPage;
