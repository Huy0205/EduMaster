'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import AdminHeader from './components/Header';
import AdminSidebar from './components/Sidebar';
import { KeyboardArrowRight, Search } from '@mui/icons-material';
import { FilterDataProvider } from '~/context';
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
            <div className="flex flex-row">
                <div className="w-[220px] h-screen">
                    <AdminSidebar />
                </div>
                <div className="flex flex-1 flex-col">
                    <AdminHeader />
                    <div className="flex flex-col flex-1 bg-foreground pt-[1px]">
                        <div className="h-[47px] mt-1 px-3 flex justify-between items-center bg-white">
                            {/* Breadcrumb */}
                            <div className="text-base text-gray-600">
                                Home <KeyboardArrowRight /> Người dùng
                            </div>
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
                        <div className="flex flex-1 mt-3 ml-3">{children}</div>
                    </div>
                </div>
            </div>
        </FilterDataProvider>
    );
}

export default AdminLayout;
