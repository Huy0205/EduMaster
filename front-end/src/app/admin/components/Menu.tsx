'use client';
import {
    Book,
    Home,
    School,
    KeyboardArrowRight,
    KeyboardArrowDown,
    AccountCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CourseService } from '~/services';

// interface AdminMenuProps {
//     onNavigate: (breadcrumbItems: { label: string; href: string }[]) => void;
// }

interface Course {
    id: string;
    name: string;
    grade: number;
}

function AdminMenu({ gradeSelected }: { gradeSelected: number }) {
    // { onNavigate }: AdminMenuProps
    const [active, setActive] = useState<string>('dashboard');
    const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
    const [courses, setCourses] = useState<Course[]>([]);

    const handleSelectItem = (
        activeNamePrev: string,
        activeNameCurrent: string,
        // label?: string, href?: string
    ) => {
        setActive(activeNameCurrent);
        // if (label && href) onNavigate([{ label, href }]);
        // else onNavigate([]);
        if (activeNamePrev === activeNameCurrent) setIsSubmenuOpen(!isSubmenuOpen);
        else setIsSubmenuOpen(activeNameCurrent.includes('reviews'));
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesRes = await CourseService.getCoursesByGrade(gradeSelected);
            const { data, message } = coursesRes.data;
            if (data) setCourses(data);
            else console.log(message);
        };
        fetchCourses();
    }, [gradeSelected]);

    return (
        <nav className="my-5 px-3">
            <ul>
                <li
                    className={`my-1 py-2 px-2 ${
                        active === 'dashboard'
                            ? 'text-primary bg-red-100'
                            : 'text-gray-500 bg-white'
                    } rounded-md transition-all`}
                >
                    <Link
                        href={'/admin/dashboard'}
                        className="flex gap-2 font-medium"
                        onClick={() => handleSelectItem(active, 'dashboard')}
                    >
                        <Home />
                        <span className="text-lg">Trang chủ</span>
                    </Link>
                </li>
                <li
                    className={`my-1 py-2 px-2 ${
                        active === 'users' ? 'text-primary bg-red-100' : 'text-gray-500 bg-white'
                    } rounded-md transition-all`}
                >
                    <Link
                        href={'/admin/users'}
                        className="flex gap-2 font-medium"
                        onClick={() => handleSelectItem(active, 'users')}
                    >
                        <AccountCircle />
                        <span className="flex-1 text-lg">Người dùng</span>
                    </Link>
                </li>
                <li className="my-1 py-2 px-2">
                    <button
                        className="w-full flex gap-2 text-gray-500 font-normal"
                        onClick={() => handleSelectItem(active, 'reviews')}
                    >
                        <School />
                        <span className="flex-1 text-lg text-start">Đề ôn tập</span>
                        <span>
                            {isSubmenuOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                        </span>
                    </button>
                    {isSubmenuOpen && (
                        <ul>
                            {courses.map((course) => (
                                <li
                                    key={course.id}
                                    className={`my-1 py-2 pl-8 pr-2 ${
                                        active === 'reviews.' + course.id
                                            ? 'text-primary bg-red-100'
                                            : 'text-gray-500 bg-white'
                                    } rounded-md transition-all`}
                                >
                                    <Link
                                        href={`/admin/reviews/${course.id}`}
                                        className="flex gap-2 font-medium"
                                        onClick={() =>
                                            handleSelectItem(active, 'reviews.' + course.id)
                                        }
                                    >
                                        <span className="text-lg">{course.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
                <li
                    className={`my-1 py-2 px-2 ${
                        active === 'quizzes' ? 'text-primary bg-red-100' : 'text-gray-500 bg-white'
                    } rounded-md transition-all`}
                >
                    <Link
                        href={'/admin/quizzes'}
                        className="flex gap-2 font-medium"
                        onClick={() =>
                            handleSelectItem(
                                active,
                                'quizzes',
                                // , 'Đề kiểm tra', '/admin/quizzes'
                            )
                        }
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
