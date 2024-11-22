import { useEffect, useState } from 'react';
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

function useUsers(grade: number) {
    const [users, setUsers] = useState<User[]>([]);

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

    return users;
}

export default useUsers;
