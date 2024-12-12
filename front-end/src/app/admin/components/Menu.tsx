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
    ExpandLess,
    ExpandMore,
    NavigateNext,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
    { icon: <Home />, label: 'Trang chủ', href: '/admin/dashboard' },
    { icon: <AccountCircle />, label: 'Người dùng', href: '/admin/users' },
    { icon: <LibraryBooks />, label: 'Chương mục', href: '/admin/topics' },
    { icon: <MenuBook />, label: 'Bài học', href: '/admin/lessons' },
    { icon: <OndemandVideo />, label: 'Bài giảng', href: '/admin/theories' },
    {
        icon: <Help />,
        label: 'Ngân hàng câu hỏi',
        children: [
            { label: 'Câu hỏi thực hành', href: '/admin/questions/practice' },
            { label: 'Câu hỏi kiểm tra', href: '/admin/questions/quiz' },
        ],
    },
    { icon: <Assessment />, label: 'Đề thực hành', href: '/admin/practices' },
    { icon: <FactCheck />, label: 'Đề kiểm tra', href: '/admin/quizzes' },
];

function AdminMenu() {
    const pathname = usePathname();
    const [active, setActive] = useState<string>('dashboard');
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const handleSelectItem = (activeNameCurrent: string) => {
        menuItems.forEach((item) => {
            if (item.children) {
                const matchedChild = item.children.find(
                    (child) => child.href.split('/')[3] === activeNameCurrent,
                );
                if (matchedChild) {
                    setActive(matchedChild.href.split('/')[3]);
                    setOpenSubmenu(item.label);
                }
            } else {
                if (item.href.split('/')[2] === activeNameCurrent) {
                    setActive(item.href.split('/')[2]);
                    setOpenSubmenu(null);
                }
            }
        });
    };

    const toggleSubmenu = (label: string) => {
        setOpenSubmenu((prev) => (prev === label ? null : label));
    };

    useEffect(() => {
        handleSelectItem(pathname.split('/').pop() || 'dashboard');
    }, [pathname]);

    return (
        <nav className="my-5 overflow-hidden">
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        {!item.children ? (
                            <Link
                                href={item.href!}
                                className={`p-3 flex items-center gap-2 font-medium transition-all hover:bg-red-100 hover:text-primary hover:scale-105 cursor-pointer ${
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
                                className={`p-3 flex items-center gap-2 font-medium transition-all hover:bg-red-100 hover:text-primary hover:scale-105 cursor-pointer ${
                                    item.children.some(
                                        (child) => active === child.href.split('/')[2],
                                    )
                                        ? 'text-primary bg-red-100'
                                        : 'text-gray-500 bg-white'
                                }`}
                                onClick={() => toggleSubmenu(item.label)}
                            >
                                {item.icon}
                                <span className="text-lg flex-1">{item.label}</span>
                                {openSubmenu === item.label ? (
                                    <ExpandMore color="inherit" />
                                ) : (
                                    <ExpandLess color="inherit" />
                                )}
                            </div>
                        )}

                        {item.children && openSubmenu === item.label && (
                            <nav className="py-1 bg-slate-50">
                                <ul className="my-2 m-3 transition-all">
                                    {item.children.map((child, childIndex) => (
                                        <li
                                            key={childIndex}
                                            className="overflow-hidden rounded-md"
                                        >
                                            <Link
                                                href={child.href}
                                                onClick={() =>
                                                    handleSelectItem(child.href.split('/')[3])
                                                }
                                                className={`p-3 flex items-center gap-2 rounded-md font-medium transition-all hover:bg-red-100 hover:text-primary hover:scale-105 cursor-pointer ${
                                                    active === child.href.split('/')[3]
                                                        ? 'text-primary bg-red-100'
                                                        : 'text-gray-500 bg-slate-50'
                                                }`}
                                            >
                                                <NavigateNext />
                                                <span className="text-md">{child.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default AdminMenu;
