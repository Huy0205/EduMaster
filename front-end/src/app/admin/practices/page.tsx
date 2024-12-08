'use client';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close, Delete, Edit, ViewList } from '@mui/icons-material';

import { useCourses, useGrades, useLessons, useTopics } from '~/app/admin/hooks';
import { useFilterData } from '../contexts';
import { PracticeService, QuestionService } from '~/services';
import AdminManagementWrapper from '../components/management';
import {
    createCourseFilter,
    createGradeFilter,
    createLessonFilter,
    createTopicFilter,
} from '../configs/filters';
import { useState } from 'react';
import QuestionView from '../components/questionView';

function AdminPracticesPage() {
    const [showDetail, setShowDetail] = useState(false);
    const [itemSelected, setItemSelected] = useState<any>(null);
    const [detailData, setDetailData] = useState<any>(null);

    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);
    const lessons = useLessons(filterData.topicId);

    const fetchData = async (filters: FilterData) => {
        if (filters.lessonId)
            return await PracticeService.getPracticesByLesson(filters.lessonId, 0);
        if (filters.topicId) return await PracticeService.getPracticesByTopic(filters.topicId);
        if (filters.courseId) return await PracticeService.getPracticesByCourse(filters.courseId);
        if (filters.grade) return await PracticeService.getPracticesByGrade(filters.grade);
        return await PracticeService.getAllPractices();
    };

    const handleShowDetail = async (item: any) => {
        setItemSelected(item);
        const questionsRes = await QuestionService.getQuestionsByPractice(item.id);
        const { data, message } = questionsRes.data;
        if (data) {
            console.log(data);
            setDetailData(data);
        } else {
            console.error(message);
        }
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
        link: '/admin/practices/choose-questions',
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
                maxWidth="md"
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
                        <h2>Chi tiết đề thực hành</h2>
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowDetail(false)}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-extrabold text-center py-2">
                            {itemSelected?.name}
                        </h2>
                        <p className="text-base font-semibold">
                            Điểm thưởng: {itemSelected?.bonusPoint}
                        </p>
                    </div>
                    <div>
                        <ul>
                            {detailData?.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    className="flex py-2 border-b border-gray-200"
                                >
                                    <div className="flex-1 flex justify-end py-3">
                                        <strong className="text-lg">Câu {index + 1}:</strong>
                                    </div>
                                    <div className="flex-9">
                                        <QuestionView data={item} />
                                    </div>
                                </div>
                            ))}
                        </ul>
                        <div className="flex justify-center pt-2">
                            <span className="text-base font-medium">---------- Hết ----------</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AdminPracticesPage;
