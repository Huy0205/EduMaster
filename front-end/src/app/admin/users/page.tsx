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
        header: ['STT', 'Họ và tên', 'Email', 'Số điện thoại', 'Lớp', 'Điểm'],
        columnsData: ['fullName', 'email', 'phoneNumber', 'currentGrade', 'totalPoint'],
        actions: [
            { label: 'Sửa', icon: Edit, onClick: (item: any) => console.log('Edit', item) },
            { label: 'Xóa', icon: Delete, onClick: (item: any) => console.log('Delete', item) },
        ],
    };

    return (
        <AdminManagementWrapper
            fetchData={fetchData}
            filterConfig={filterConfig}
            tableConfig={tableConfig}
        />
    );
}

export default AdminUsersPage;
