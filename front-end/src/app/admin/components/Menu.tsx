'use client';
import {
    Home,
    AccountCircle,
    Help,
    LibraryBooks,
    MenuBook,
    OndemandVideo,
    Assessment,
    FactCheck,
} from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';

// interface AdminMenuProps {
//     onNavigate: (breadcrumbItems: { label: string; href: string }[]) => void;
// }

// interface Course {
//     id: string;
//     name: string;
//     grade: number;
// }

const menuItems = [
    { icon: <Home />, label: 'Trang chủ', href: '/admin/dashboard' },
    { icon: <AccountCircle />, label: 'Người dùng', href: '/admin/users' },
    { icon: <LibraryBooks />, label: 'Chương mục', href: '/admin/topics' },
    { icon: <MenuBook />, label: 'Bài học', href: '/admin/lessons' },
    { icon: <OndemandVideo />, label: 'Bài giảng', href: '/admin/theories' },
    { icon: <Help />, label: 'Câu hỏi', href: '/admin/questions' },
    { icon: <Assessment />, label: 'Đề thực hành', href: '/admin/practices' },
    { icon: <FactCheck />, label: 'Đề kiểm tra', href: '/admin/quizzes' },
];

function AdminMenu() {
    const [active, setActive] = useState<string>('dashboard');

    const handleSelectItem = (activeNamePrev: string, activeNameCurrent: string) => {
        setActive(activeNameCurrent);
    };

    return (
        <nav className="my-5 px-3">
            <ul>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`my-1 py-2 px-2 ${
                            active === item.href.split('/')[2]
                                ? 'text-primary bg-red-100'
                                : 'text-gray-500 bg-white'
                        } rounded-md transition-all`}
                    >
                        <Link
                            href={item.href}
                            className="flex items-center gap-2 font-medium"
                            onClick={() => handleSelectItem(active, item.href.split('/')[2])}
                        >
                            {item.icon}
                            <span className="text-lg">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default AdminMenu;
