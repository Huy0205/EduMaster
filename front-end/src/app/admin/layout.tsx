'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminHeader from './components/Header';
import AdminSidebar from './components/Sidebar';
import { Home, NavigateNext } from '@mui/icons-material';
import { FilterDataProvider, QuestionsSelectedProvider } from './contexts';
import Link from 'next/link';
import { Breadcrumbs, Typography } from '@mui/material';
import { useLoadingGlobal } from './contexts/loadingGlobalContext';
import Loading from './components/loading';

const breadcrumbMap: Record<string, string> = {
    dashboard: 'Trang chủ',
    users: 'Danh sách người dùng',
    topics: 'Danh sách chương mục',
    lessons: 'Danh sách bài học',
    theories: 'Danh sách bài giảng',
    questions: 'Ngân hàng câu hỏi',
    practice: 'Danh sách câu hỏi thực hành',
    quiz: 'Danh sách câu hỏi kiểm tra',
    add: 'Thêm mới',
    practices: 'Danh sách bài thực hành',
    quizzes: 'Danh sách bài kiểm tra',
    'choose-questions': 'Chọn câu hỏi',
    create: 'Tạo đề',
};

function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
    const pathname = usePathname();

    const { isLoadingGlobal } = useLoadingGlobal();

    const isLoginPage = pathname === '/admin/login';
    if (isLoginPage) return <>{children}</>;

    return (
        <FilterDataProvider>
            <QuestionsSelectedProvider>
                <div className="w-screen h-screen flex bg-foreground">
                    <div className="w-[17%]">
                        <AdminSidebar />
                    </div>
                    <div className="w-[83%] flex flex-col gap-1">
                        <AdminHeader />
                        <Breadcrumbs
                            aria-label="breadcrumb"
                            separator={<NavigateNext fontSize="small" />}
                            className="h-[50px] flex items-center px-3 bg-white"
                        >
                            <Link href="/admin/dashboard">
                                <Home fontSize="small" />
                            </Link>
                            {pathname
                                .replace('/admin', '') // Loại bỏ phần '/admin'
                                .split('/')
                                .filter(Boolean) // Loại bỏ các phần trống
                                .map((segment, index, array) => {
                                    const isCurrent = index === array.length - 1;
                                    const href = `/admin/${array.slice(0, index + 1).join('/')}`;
                                    const label = breadcrumbMap[segment] || segment; // Lấy từ map hoặc dùng segment
                                    return isCurrent ? (
                                        <Typography
                                            key={segment}
                                            color="textPrimary"
                                        >
                                            {label}
                                        </Typography>
                                    ) : (
                                        <Link
                                            key={segment}
                                            href={href}
                                            className="text-gray-400 hover:underline"
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                        </Breadcrumbs>

                        <div className="flex-auto h-[calc(100vh-116px)] ml-3 mt-2 bg-white">
                            {children}
                        </div>
                    </div>
                    {isLoadingGlobal && (
                        <div className="fixed inset-0 bg-slate-700 bg-opacity-50 z-50 flex items-center justify-center">
                            <Loading />
                        </div>
                    )}
                    <ToastContainer
                        position="bottom-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </QuestionsSelectedProvider>
        </FilterDataProvider>
    );
}

export default AdminLayout;
