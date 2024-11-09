'use client';
import { Book, Home, School, KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';

function AdminMenu() {
    const [active, setActive] = useState<string>('dashboard');

    return (
        <nav className="my-5 px-3">
            <ul>
                <li
                    className={`my-1 py-2 px-2 ${
                        active === 'dashboard'
                            ? 'text-primary bg-red-100'
                            : 'text-gray-500 bg-white'
                    } rounded-md`}
                >
                    <Link
                        href={'/admin/dashboard'}
                        className="flex gap-2 font-medium"
                        onClick={() => setActive('dashboard')}
                    >
                        <Home />
                        <span className="text-lg">Trang chủ</span>
                    </Link>
                </li>
                <li className="py-3 px-2">
                    <Link
                        href={'/admin/reviews'}
                        className="flex gap-2 text-gray-500 font-normal"
                    >
                        <School />
                        <span className="flex-1 text-lg">Đề ôn tập</span>
                        <KeyboardArrowRight />
                        {/* <KeyboardArrowDown /> */}
                    </Link>
                </li>
                <li
                    className={`my-1 py-2 px-2 ${
                        active === 'quizzes' ? 'text-primary bg-red-100' : 'text-gray-500 bg-white'
                    } rounded-md`}
                >
                    <Link
                        href={'/admin/quizzes'}
                        className="flex gap-2 font-medium"
                        onClick={() => setActive('quizzes')}
                    >
                        <Book />
                        <span className="text-lg">Đề kiểm tra</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default AdminMenu;
