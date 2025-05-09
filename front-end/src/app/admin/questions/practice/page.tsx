'use client';
import { useState } from 'react';
import { Delete, ViewList } from '@mui/icons-material';

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
import AdminDialogQuestionDetail from '../../components/dialogQuestionDetail';
import AdminConfirmDialog from '../../components/confirmDialog';
import { toast } from 'react-toastify';

function AdminPracticeQuestionsPage() {
    const [showDetail, setShowDetail] = useState(false);
    const [dataSelected, setDataSelected] = useState<any>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<any>(null);

    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);
    const lessons = useLessons(filterData.topicId);

    const fetchData = async (filters: any) => {
        if (filters.lessonId) return await QuestionService.getQuestionsByLesson(filters.lessonId);
        if (filters.topicId)
            return await QuestionService.getQuestionsByTopic(false, filters.topicId);
        if (filters.courseId)
            return await QuestionService.getQuestionsByCourse(false, filters.courseId);
        if (filters.grade) return await QuestionService.getQuestionsByGrade(false, filters.grade);
        return await QuestionService.getAllQuestions(false);
    };

    let triggerReload: ((reload: boolean) => void) | undefined;

    const handleReloadSetup = (setReloadFn: (reload: boolean) => void) => {
        triggerReload = setReloadFn;
    };

    const handleDelete = async (questionId: string) => {
        try {
            const updateRes = await QuestionService.updateQuestion(questionId, { status: -1 });
            const { data, message } = updateRes.data;
            if (data) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Đã xóa câu hỏi thành công');
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        }
        setIsConfirmDialogOpen(false);
    };

    const handleOpenConfirmDialog = (question: any) => {
        setQuestionToDelete(question);
        setIsConfirmDialogOpen(true);
    };

    const handleShowDetail = async (data: any) => {
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
            {
                key: 'topic.name',
                label: 'Chương mục',
                width: '250px',
                align: 'left',
            },
            {
                key: 'lesson.name',
                label: 'Bài học',
                width: '250px',
                align: 'left',
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
        link: '/admin/questions/practice/add',
        disabled: !filterData.lessonId,
    };

    const confirmDialogConfig = {
        open: isConfirmDialogOpen,
        title: 'Xác nhận câu hỏi thực hành',
        content: questionToDelete?.content,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(questionToDelete.id),
    };

    const dialogQuestionDetailConfig = {
        open: showDetail,
        onClose: () => setShowDetail(false),
        data: dataSelected,
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                filterConfig={filterConfig}
                tableConfig={tableConfig}
                addBtn={addBtn}
                onReloadTable={handleReloadSetup}
            />
            <AdminConfirmDialog {...confirmDialogConfig} />
            <AdminDialogQuestionDetail {...dialogQuestionDetailConfig} />
        </>
    );
}

export default AdminPracticeQuestionsPage;
