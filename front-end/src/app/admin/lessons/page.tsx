'use client';
import { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { LessonService } from '~/services';
import AdminManagementWrapper from '../components/management';
import AdminFormDialog from '../components/FormDialog';
import AdminConfirmDialog from '../components/ConfirmDialog';

function AdminLessonsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'update'>('add');
    const [currentData, setCurrentData] = useState<any>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [lessonToDelete, setTopicToDelete] = useState<any>(null);

    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const fetchData = async (filters: any) => {
        if (filters.topicId) return await LessonService.getLessonsByTopic(filters.topicId, 0);
        if (filters.courseId) return await LessonService.getLessonsByCourse(filters.courseId);
        if (filters.grade) return await LessonService.getLessonsByGrade(filters.grade);
        return await LessonService.getAllLessons();
    };

    let triggerReload: ((reload: boolean) => void) | undefined;

    const handleReloadSetup = (setReloadFn: (reload: boolean) => void) => {
        triggerReload = setReloadFn;
    };

    const handleOpenFormDialog = (mode: 'add' | 'update', data?: any) => {
        setDialogMode(mode);
        setCurrentData(data || {});
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleSave = async (data: any) => {
        if (dialogMode === 'add') {
            const addRes = await LessonService.addLesson({
                lessonName: data.name,
                topicId: filterData.topicId,
            });
            const { data: newLesson, message } = addRes.data;
            if (newLesson) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Thêm bài học thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        } else {
            console.log('Update lesson:', data);
            const updateRes = await LessonService.updateLesson(data.id, {
                lessonName: data.name,
            });
            const { data: updatedLesson, message } = updateRes.data;
            if (updatedLesson) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Cập nhật bài học thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        }
        handleCloseDialog();
    };

    const handleOpenConfirmDialog = (lesson: any) => {
        setTopicToDelete(lesson);
        setIsConfirmDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        const deletedRes = await LessonService.updateLesson(id, { status: -1 });
        const { data: deletedLesson, message } = deletedRes.data;
        if (deletedLesson) {
            if (typeof triggerReload === 'function') {
                triggerReload(true);
            }
            toast.success('Xóa bài học thành công');
        } else {
            toast.error('Có lỗi xảy ra:', message);
        }
        setIsConfirmDialogOpen(false);
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
        columns: [
            {
                key: 'name',
                label: 'Tên bài học',
                width: 'auto',
                align: 'left',
            },
            {
                key: 'status',
                label: 'Trạng thái',
                width: '200px',
                align: 'center',
            },
        ],
        actions: [
            {
                label: 'Sửa',
                icon: Edit,
                color: 'blue',
                onClick: (item: any) => handleOpenFormDialog('update', item),
            },
            {
                label: 'Xóa',
                icon: Delete,
                color: 'red',
                onClick: (item: any) => handleOpenConfirmDialog(item),
            },
        ],
    };

    const addBtn = {
        onClick: () => handleOpenFormDialog('add'),
        disabled: !filterData.topicId,
    };

    const formDialogConfig = {
        open: isDialogOpen,
        onClose: handleCloseDialog,
        onSave: handleSave,
        title: dialogMode === 'add' ? 'Thêm bài học mới' : 'Chỉnh sửa bài học',
        fields: [{ key: 'name', label: 'Tên bài học', type: 'text' }],
        initialData: currentData,
    };

    const confirmDialogConfig = {
        open: isConfirmDialogOpen,
        title: 'Xác nhận xóa bài học',
        content: lessonToDelete?.name,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(currentData.id),
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                updateData={LessonService.updateLesson}
                filterConfig={filterConfig}
                tableConfig={tableConfig}
                addBtn={addBtn}
                onReloadTable={handleReloadSetup}
            />
            <AdminFormDialog {...formDialogConfig} />
            <AdminConfirmDialog {...confirmDialogConfig} />
        </>
    );
}

export default AdminLessonsPage;
