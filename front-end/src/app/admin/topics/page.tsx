'use client';
import { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useCourses, useGrades } from '~/app/admin/hooks';
import { useFilterData } from '../contexts';
import { TopicService } from '~/services';
import AdminManagementWrapper from '../components/management';
import AdminFormDialog from '../components/FormDialog';
import AdminConfirmDialog from '../components/confirmDialog';
import { createCourseFilter, createGradeFilter } from '../configs/filters';

function AdminTopicsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'update'>('add');
    const [currentData, setCurrentData] = useState<any>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<any>(null);

    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);

    const fetchData = async (filters: FilterData) => {
        if (filters.courseId) return await TopicService.getTopicsByCourse(filters.courseId, 0);
        if (filters.grade) return await TopicService.getTopicByGrade(filters.grade);
        return await TopicService.getAllTopics();
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
            const addRes = await TopicService.addTopic({
                topicName: data.name,
                courseId: filterData.courseId,
            });
            const { data: newTopic, message } = addRes.data;
            if (newTopic) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Thêm chương mục thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        } else {
            const updateRes = await TopicService.updateTopic(data.id, {
                topicName: data.name,
            });
            const { data: updatedTopic, message } = updateRes.data;
            if (updatedTopic) {
                if (typeof triggerReload === 'function') {
                    triggerReload(true);
                }
                toast.success('Cập nhật chương mục thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        }
        handleCloseDialog();
    };

    const handleOpenConfirmDialog = (topic: any) => {
        setTopicToDelete(topic);
        setIsConfirmDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        const deletedRes = await TopicService.updateTopic(id, { status: -1 });
        const { data: deletedTopic, message } = deletedRes.data;
        if (deletedTopic) {
            if (typeof triggerReload === 'function') {
                triggerReload(true);
            }
            toast.success('Xóa chương mục thành công');
        } else {
            toast.error('Có lỗi xảy ra:', message);
        }
        setIsConfirmDialogOpen(false);
    };

    const filterConfig = [createGradeFilter(grades), createCourseFilter(courses, filterData.grade)];

    const tableConfig = {
        columns: [
            {
                key: 'name',
                label: 'Tên chương mục',
                width: 'auto',
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
        disabled: !filterData.courseId,
    };

    const formDialogConfig = {
        open: isDialogOpen,
        onClose: handleCloseDialog,
        onSave: handleSave,
        title: dialogMode === 'add' ? 'Thêm chương mục mới' : 'Chỉnh sửa chương mục',
        fields: [{ key: 'name', label: 'Tên chương mục', type: 'text' }],
        initialData: currentData,
    };

    const confirmDialogConfig = {
        open: isConfirmDialogOpen,
        title: 'Xác nhận xóa chương mục',
        content: topicToDelete?.name,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(topicToDelete.id),
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                updateData={TopicService.updateTopic}
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

export default AdminTopicsPage;
