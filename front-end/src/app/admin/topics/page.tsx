'use client';
import { Delete, Edit } from '@mui/icons-material';

import { useCourses, useGrades } from '~/hooks';
import { useFilterData } from '~/context';
import { TopicService } from '~/services';
import AdminManagementWrapper from '../components/management';
import AdminFormDialog from '../components/FormDialog';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AdminConfirmDialog from '../components/ConfirmDialog';

function AdminTopicsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'update'>('add');
    const [currentData, setCurrentData] = useState<any>(null);
    const [reLoadTable, setReLoadTable] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<any>(null);

    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);

    const fetchData = async (filters: any) => {
        if (filters.courseId) return await TopicService.getTopicsByCourse(filters.courseId, 0);
        if (filters.grade) return await TopicService.getTopicByGrade(filters.grade);
        return await TopicService.getAllTopics();
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
                setReLoadTable(!reLoadTable);
                toast.success('Thêm chủ đề thành công');
            } else {
                toast.error('Có lỗi xảy ra:', message);
            }
        } else {
            const updateRes = await TopicService.updateTopic(data.id, {
                topicName: data.name,
            });
            const { data: updatedTopic, message } = updateRes.data;
            if (updatedTopic) {
                setReLoadTable(!reLoadTable);
                toast.success('Cập nhật chủ đề thành công');
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
            setReLoadTable(!reLoadTable);
            toast.success('Xóa chủ đề thành công');
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
    ];

    const tableConfig = {
        columns: [
            {
                key: 'name',
                label: 'Tên chủ đề',
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
        disabled: !filterData.courseId,
        currentPath: '/admin/topics',
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
        title: 'Xác nhận xóa',
        content: topicToDelete?.name,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(currentData.id),
    };

    return (
        <>
            <AdminManagementWrapper
                fetchData={fetchData}
                updateData={TopicService.updateTopic}
                filterConfig={filterConfig}
                tableConfig={tableConfig}
                addBtn={addBtn}
                reLoadTable={reLoadTable}
            />
            <AdminFormDialog {...formDialogConfig} />
            <AdminConfirmDialog {...confirmDialogConfig} />
        </>
    );
}

export default AdminTopicsPage;
