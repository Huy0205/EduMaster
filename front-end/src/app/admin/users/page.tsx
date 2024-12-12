'use client';
import { useGrades } from '~/app/admin/hooks';
import { UserService } from '~/services';
import AdminManagementWrapper from '../components/management';
import { Delete } from '@mui/icons-material';
import { createGradeFilter } from '../configs/filters';
import { toast } from 'react-toastify';
import AdminConfirmDialog from '../components/confirmDialog';
import { useState } from 'react';

function AdminUsersPage() {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const grades = useGrades();

    const fetchData = async (filters: FilterData) => {
        if (filters.grade) return await UserService.getUsersByGrade(filters.grade);
        return await UserService.getUsersByRole(1);
    };

    const handleDelete = async (userId: string) => {
        try {
            const updateRes = await UserService.updateUser(userId, { status: -1 });
            const { data, message } = updateRes.data;
            if (data) {
                toast.success('Đã xóa người dùng ' + data.fullName);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        }
    };

    const filterConfig = [createGradeFilter(grades)];

    const tableConfig = {
        columns: [
            {
                key: 'fullName',
                label: 'Họ và tên',
                width: '250px',
                align: 'left',
            },
            {
                key: 'email',
                label: 'Email',
                width: 'auto',
                align: 'left',
            },
            {
                key: 'phoneNumber',
                label: 'Số điện thoại',
                width: '130px',
                align: 'left',
            },
            {
                key: 'currentGrade',
                label: 'Lớp',
                width: '60px',
                align: 'center',
            },
            {
                key: 'totalPoint',
                label: 'Điểm',
                width: '100px',
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
                onClick: (item: any) => setUserToDelete(item),
            },
        ],
    };

    const addBtn = {};

    const confirmDialogConfig = {
        title: 'Xác nhận xóa người dùng',
        content: userToDelete?.fullName,
        open: isConfirmDialogOpen,
        onClose: () => setIsConfirmDialogOpen(false),
        onConfirm: () => handleDelete(userToDelete.id),
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
        </>
    );
}

export default AdminUsersPage;
