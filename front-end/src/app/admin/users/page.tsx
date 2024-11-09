'use client';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { useGrade } from '~/context/GradeContext';
import { UserService } from '~/services';

interface User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    avatar: string;
    currentGrade: number;
    totalPoint: number;
    role: number;
}

function AdminUserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { grade } = useGrade();

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRes = await UserService.getUsersByGrade(grade);
            const { data, message } = usersRes.data;
            if (data) {
                setUsers(data);
            } else {
                console.error(message);
            }
        };
        fetchUsers();
    }, [grade]);

    return (
        <div className="flex flex-col flex-1 bg-white">
            <div className="p-3">
                <h3 className="text-lg text-gray-600 font-bold">Quản lý tài khoản người dùng</h3>
            </div>
            <div className="w-full p-3 pt-0">
                <table className="w-full border-collapse text-base text-gray-500">
                    <thead>
                        <tr>
                            <th className="border-2 border-slate-300">STT</th>
                            <th className="border-2 border-slate-300">Họ và tên</th>
                            <th className="border-2 border-slate-300">Email</th>
                            <th className="border-2 border-slate-300">Số điện thoại</th>
                            <th className="border-2 border-slate-300">Điểm thưởng</th>
                            <th className="border-2 border-slate-300 p-1">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td className="border-2 border-slate-300 text-center">
                                    {index + 1}
                                </td>
                                <td className="border-2 border-slate-300 px-1">{user.fullName}</td>
                                <td className="border-2 border-slate-300 px-1">{user.email}</td>
                                <td className="border-2 border-slate-300 text-center">
                                    {user.phoneNumber}
                                </td>
                                <td className="border-2 border-slate-300 text-center">
                                    {user.totalPoint}
                                </td>
                                <td className="border-2 border-slate-300 p-1">
                                    <div className="flex gap-2 justify-center items-center">
                                        <button className="border-2 border-slate-300 rounded-md p-[1px]">
                                            <Edit />
                                        </button>
                                        <button className="border-2 border-slate-300 rounded-md p-[1px]">
                                            <Delete />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUserManagementPage;
