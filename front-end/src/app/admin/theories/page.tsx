'use client';
import { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useCourses, useGrades, useLessons, useTopics } from '~/app/admin/hooks';
import { useFilterData } from '../contexts';
import { TheoryService } from '~/services';
import AdminManagementWrapper from '../components/management';
import AdminFormDialog from '../components/FormDialog';
import AdminConfirmDialog from '../components/ConfirmDialog';
import {
    createCourseFilter,
    createGradeFilter,
    createLessonFilter,
    createTopicFilter,
} from '../configs/filters';

function AdminTheoriesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'update'>('add');
    const [currentData, setCurrentData] = useState<any>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [theoryToDelete, setTheoryToDelete] = useState<any>(null);

    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);
    const lessons = useLessons(filterData.topicId);

    const fetchData = async (filters: FilterData) => {
        if (filters.lessonId) return await TheoryService.getTheoriesByLesson(filters.lessonId, 0);
        if (filters.topicId) return await TheoryService.getTheoriesByTopic(filters.topicId);
        if (filters.courseId) return await TheoryService.getTheoriesByCourse(filters.courseId);
        if (filters.grade) return await TheoryService.getTheoriesByGrade(filters.grade);
        return await TheoryService.getAllTheories();
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
            const addRes = await TheoryService.addTheory({
                title: data.title,
                url: data.url,
                description: data.description,
                lessonId: filterData.lessonId,
            });
            const { data: newTheory, message } = addRes.data;
            if (newTheory) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Thêm bài giảng thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        } else {
            const updateRes = await TheoryService.updateTheory(data.id, {
                title: data.title,
                url: data.url,
                description: data.description,
            });
            const { data: updatedTheory, message } = updateRes.data;
            if (updatedTheory) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Cập nhật bài giảng thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        }
        handleCloseDialog();
    };

    const handleOpenConfirmDialog = (lesson: any) => {
        setTheoryToDelete(lesson);
        setIsConfirmDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        console.log('Deleting theory:', id);
        const deletedRes = await TheoryService.updateTheory(id, { status: -1 });
        const { data: deletedTheory, message } = deletedRes.data;
        if (deletedTheory) {
            if (typeof triggerReload === 'function') {
                triggerReload(true);
            }
            toast.success('Xóa bài giảng thành công');
        } else {
            toast.error('Có lỗi xảy ra:', message);
        }
        setIsConfirmDialogOpen(false);
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
                key: 'title',
                label: 'Tiêu đề',
                width: 'auto',
                align: 'left',
            },
            {
                key: 'url',
                label: 'Đường dẫn',
                width: '200px',
                align: 'left',
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
        disabled: !filterData.lessonId,
    };

    const formDialogConfig = {
        open: isDialogOpen,
        onClose: handleCloseDialog,
        onSave: handleSave,
        title: dialogMode === 'add' ? 'Thêm bài giảng mới' : 'Chỉnh sửa bài giảng',
        fields: [
            { key: 'title', label: 'Tiêu đề', type: 'text' },
            { key: 'url', label: 'Đường dẫn', type: 'text' },
            { key: 'description', label: 'Mô tả', type: 'text', multiline: true },
        ],
        initialData: currentData,
    };

    const confirmDialogConfig = {
        open: isConfirmDialogOpen,
        title: 'Xác nhận xóa bài giảng',
        content: theoryToDelete?.title,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(theoryToDelete.id),
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                updateData={TheoryService.updateTheory}
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

export default AdminTheoriesPage;
