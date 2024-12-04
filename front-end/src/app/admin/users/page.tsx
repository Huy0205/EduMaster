'use client';
import { useGrades } from '~/hooks';
import { UserService } from '~/services';
import AdminManagementWrapper from '../components/management';
import { Delete, Edit } from '@mui/icons-material';

function AdminUsersPage() {
    const grades = useGrades();

    const fetchData = async (filters: any) => {
        if (filters.grade) return await UserService.getUsersByGrade(filters.grade);
        return await UserService.getUsersByRole(1);
    };

    const filterConfig = [
        {
            key: 'grade',
            placeholder: 'Chọn lớp',
            options: grades.map((grade) => ({ value: grade, label: 'Lớp ' + grade })),
        },
    ];

    const tableConfig = {
        columns: [
            {
                key: 'fullName',
                label: 'Họ và tên',
                width: 'auto',
                align: 'left',
            },
            {
                key: 'email',
                label: 'Email',
                width: '200px',
                align: 'center',
            },
            {
                key: 'phoneNumber',
                label: 'Số điện thoại',
                width: '200px',
                align: 'center',
            },
            {
                key: 'currentGrade',
                label: 'Lớp',
                width: '200px',
                align: 'center',
            },
            {
                key: 'totalPoint',
                label: 'Điểm',
                width: '200px',
                align: 'center',
            },
        ],
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
        ],
    };

    const addBtn = {};

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
            addBtn={addBtn}
        />
    );
}

export default AdminUsersPage;
