'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminHeader from './components/Header';
import AdminSidebar from './components/Sidebar';
import { Home, KeyboardArrowRight, Search } from '@mui/icons-material';
import { FilterDataProvider } from './contexts';
import Link from 'next/link';
import { Breadcrumbs } from '@mui/material';
// import Link from 'next/link';

interface AdminLayoutProps {
    children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
    const pathname = usePathname();

    const isLoginPage = pathname === '/admin/login';
    if (isLoginPage) return <>{children}</>;

    return (
        <FilterDataProvider>
            <div className="flex flex-row bg-foreground">
                <div className="w-[260px] h-screen">
                    <AdminSidebar />
                </div>
                <div className="flex flex-1 flex-col">
                    <AdminHeader />
                    <div className=" flex-1 pt-[1px]">
                        <div className="h-[47px] mt-[3px] px-3 flex justify-between items-center bg-white">
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link href="/admin/dashboard">
                                    <Home fontSize="small" />
                                </Link>
                                {pathname.split('/').map((item, index) => (
                                    <Link
                                        key={index}
                                        href="/admin/dashboard"
                                    >
                                        {item}
                                        <KeyboardArrowRight fontSize="small" />
                                    </Link>
                                ))}
                            </Breadcrumbs>
                            <div className="flex border border-gray-400 rounded-xl ">
                                <div className="flex flex-1 px-2 py-1 rounded-xl">
                                    <input
                                        type="search"
                                        className="flex-1 text-base text-gray-600 outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="text-gray-600 border-l border-gray-400 px-2 hover:bg-gray-200 rounded-r-xl"
                                >
                                    <Search />
                                </button>
                            </div>
                        </div>
                        <div className="h-[calc(100%-62px)] flex justify-center mt-[12px] ml-[12px] bg-white">
                            {children}
                        </div>
                    </div>
                </div>
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
        </FilterDataProvider>
    );
}

export default AdminLayout;
