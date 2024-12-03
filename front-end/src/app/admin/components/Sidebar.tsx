'use client';
import AdminMenu from './Menu';
function AdminSidebar() {
    return (
        <aside className="w-full h-full rounded-br-md bg-white shadow-xl">
            <div>
                <h2 className="text-2xl font-semibold text-primary text-center pt-8 pb-4">
                    EduMaster
                </h2>
                <div className="flex items-center">
                    <div className="flex-1 h-[2px] bg-primary"></div>
                    <div className="px-2 flex items-center justify-center shrink-0">
                        <span className="text-2xl text-primary pt-3">* * *</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-primary"></div>
                </div>
            </div>
            <AdminMenu />
        </aside>
    );
}

export default AdminSidebar;
