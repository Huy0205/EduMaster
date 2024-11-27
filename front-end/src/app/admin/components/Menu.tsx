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

const menuItems = [
    { icon: <Home />, label: 'Trang chủ', href: '/admin/dashboard' },
    { icon: <AccountCircle />, label: 'Người dùng', href: '/admin/users' },
    { icon: <LibraryBooks />, label: 'Chương mục', href: '/admin/topics' },
    { icon: <MenuBook />, label: 'Bài học', href: '/admin/lessons' },
    { icon: <OndemandVideo />, label: 'Bài giảng', href: '/admin/theories' },
    {
        icon: <Help />,
        label: 'Câu hỏi',
        children: [
            { icon: <Help />, label: 'Thực hành', href: '/admin/questions/practice' },
            { icon: <Help />, label: 'Kiểm tra', href: '/admin/questions/quiz' },
        ],
    },
    { icon: <Assessment />, label: 'Đề thực hành', href: '/admin/practices' },
    { icon: <FactCheck />, label: 'Đề kiểm tra', href: '/admin/quizzes' },
];

function AdminMenu() {
    const [active, setActive] = useState<string>('dashboard');
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const handleSelectItem = (activeNameCurrent: string) => {
        setActive(activeNameCurrent);
    };

    const toggleSubmenu = (label: string) => {
        setOpenSubmenu((prev) => (prev === label ? null : label));
    };

    return (
        <nav className="my-5 px-3">
            <ul>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className="my-1"
                    >
                        {!item.children ? (
                            <Link
                                href={item.href!}
                                className={`py-2 px-2 flex items-center gap-2 font-medium rounded-md transition-all hover:bg-red-100 hover:text-primary cursor-pointer ${
                                    active === item.href.split('/')[2]
                                        ? 'text-primary bg-red-100'
                                        : 'text-gray-500 bg-white'
                                }`}
                                onClick={() => handleSelectItem(item.href.split('/')[2])}
                            >
                                {item.icon}
                                <span className="text-lg flex-1">{item.label}</span>
                            </Link>
                        ) : (
                            <div
                                className={`py-2 px-2 flex items-center gap-2 font-medium rounded-md transition-all hover:bg-red-100 hover:text-primary cursor-pointer ${
                                    openSubmenu === item.label
                                        ? 'text-primary bg-red-100'
                                        : 'text-gray-500 bg-white'
                                }`}
                                onClick={() => toggleSubmenu(item.label)}
                            >
                                {item.icon}
                                <span className="text-lg flex-1">{item.label}</span>
                                <span className="text-sm text-gray-400">
                                    {openSubmenu === item.label ? '▲' : '▼'}
                                </span>
                            </div>
                        )}

                        {item.children && openSubmenu === item.label && (
                            <ul className="pl-6 pt-1 space-y-1 bg-slate-100">
                                {item.children.map((child, childIndex) => (
                                    <li
                                        key={childIndex}
                                        className="py-1 px-2 rounded-md transition-all hover:bg-gray-100"
                                    >
                                        <Link
                                            href={child.href}
                                            className="flex items-center gap-2 text-gray-600 hover:text-primary"
                                            onClick={() =>
                                                handleSelectItem(child.href.split('/')[3])
                                            }
                                        >
                                            {child.icon}
                                            <span className="text-md">{child.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default AdminMenu;
