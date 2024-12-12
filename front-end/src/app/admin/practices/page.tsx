'use client';
import { Delete, ViewList } from '@mui/icons-material';

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
import AdminDialogPracticeOrQuizDetail from '../components/dialogPracticeOrQuizDetail';
import AdminConfirmDialog from '../components/confirmDialog';
import { toast } from 'react-toastify';

function AdminPracticesPage() {
    const [showDetail, setShowDetail] = useState(false);
    const [itemSelected, setItemSelected] = useState<any>(null);
    const [detailData, setDetailData] = useState<any>(null);
    const [practiceToDelete, setPracticeToDelete] = useState<any>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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

    let triggerReload: ((reload: boolean) => void) | undefined;

    const handleReloadSetup = (setReloadFn: (reload: boolean) => void) => {
        triggerReload = setReloadFn;
    };

    const handleDelete = async (practiceId: string) => {
        try {
            const updateRes = await PracticeService.updatePractice(practiceId, { status: -1 });
            const { data, message } = updateRes.data;
            if (data) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Xóa đề thực hành thành công');
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        }
        setIsConfirmDialogOpen(false);
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
    const handleOpenConfirmDialog = (practices: any) => {
        setPracticeToDelete(practices);
        setIsConfirmDialogOpen(true);
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
            // {
            //     label: 'Sửa',
            //     icon: Edit,
            //     color: 'blue',
            //     onClick: (item: any) => console.log('Edit', item),
            // },
            {
                label: 'Xóa',
                icon: Delete,
                color: 'red',
                onClick: (item: any) => handleOpenConfirmDialog(item),
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

    const confirmDialogConfig = {
        open: isConfirmDialogOpen,
        title: 'Xác nhận xóa đề thực hành',
        content: practiceToDelete?.name,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(practiceToDelete.id),
    };

    const dialogDetailConfig = {
        open: showDetail,
        onClose: () => setShowDetail(false),
        title: 'Chi tiết đề thực hành',
        name: itemSelected?.name,
        bonusPoint: itemSelected?.bonusPoint,
        questions: detailData,
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                updateData={PracticeService.updatePractice}
                filterConfig={filterConfig}
                tableConfig={tableConfig}
                addBtn={addBtn}
                onReloadTable={handleReloadSetup}
            />
            <AdminConfirmDialog {...confirmDialogConfig} />
            <AdminDialogPracticeOrQuizDetail {...dialogDetailConfig} />
        </>
    );
}

export default AdminPracticesPage;
