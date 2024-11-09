'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import AdminHeader from './components/Header';
import AdminSidebar from './components/Sidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
    const pathname = usePathname();

    const isLoginPage = pathname === '/admin/login';
    if (isLoginPage) return <>{children}</>;

    return (
        <div className="flex flex-row">
            <div className="w-[220px] h-screen">
                <AdminSidebar />
            </div>
            <div className="flex flex-1 flex-col">
                <AdminHeader />
                <div className="flex-1 bg-foreground">{children}</div>
            </div>
        </div>
    );
}

export default AdminLayout;
