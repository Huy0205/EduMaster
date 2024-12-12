'use client';
import { Delete, ViewList } from '@mui/icons-material';

import { useCourses, useGrades, useTopics } from '~/app/admin/hooks';
import { useFilterData } from '~/app/admin/contexts';
import { QuestionService, QuizService } from '~/services';
import AdminManagementWrapper from '../components/management';
import { createCourseFilter, createGradeFilter, createTopicFilter } from '../configs/filters';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AdminConfirmDialog from '../components/confirmDialog';
import AdminDialogPracticeOrQuizDetail from '../components/dialogPracticeOrQuizDetail';

function AdminQuizzesPage() {
    const [quizToDelete, setQuizToDelete] = useState<any>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isShowDetail, setIsShowDetail] = useState(false);
    const [itemSelected, setItemSelected] = useState<any>(null);
    const [detailData, setDetailData] = useState<any>();

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

    const handleDelete = async (quizId: string) => {
        try {
            const updateRes = await QuizService.updateQuiz(quizId, { status: -1 });
            const { data, message } = updateRes.data;
            if (data) {
                toast.success('Đã xóa đề kiểm tra: ' + data.name);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        }
    };

    const handleShowDetail = async (item: any) => {
        setItemSelected(item);
        try {
            const questionsRes = await QuestionService.getQuestionsByQuiz(item.id);
            const { data, message } = questionsRes.data;
            if (data) {
                setDetailData(data);
            } else {
                throw new Error(message);
            }
            setIsShowDetail(true);
        } catch (error) {
            setIsShowDetail(false);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        }
    };

    const filterConfig = [
        createGradeFilter(grades),
        createCourseFilter(courses, filterData.grade),
        createTopicFilter(topics, filterData.courseId),
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
                onClick: (item: any) => setQuizToDelete(item),
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
        link: '/admin/quizzes/choose-questions',
        disabled: !filterData.topicId,
    };

    const confirmDialogConfig = {
        open: isConfirmDialogOpen,
        title: 'Xác nhận đề kiểm tra',
        content: quizToDelete?.name,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(quizToDelete.id),
    };

    const dialogDetailConfig = {
        open: isShowDetail,
        onClose: () => setIsShowDetail(false),
        title: 'Chi tiết đề kiểm tra',
        name: itemSelected.name,
        time: itemSelected.time,
        bonusPoint: itemSelected.bonusPoint,
        questions: detailData,
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                filterConfig={filterConfig}
                tableConfig={tableConfig}
                addBtn={addBtn}
            />
            <AdminConfirmDialog {...confirmDialogConfig} />
            <AdminDialogPracticeOrQuizDetail {...dialogDetailConfig} />
        </>
    );
}

export default AdminQuizzesPage;
