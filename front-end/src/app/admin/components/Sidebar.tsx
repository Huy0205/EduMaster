import AdminMenu from './Menu';
function AdminSidebar() {
    return (
        <aside className="w-full h-full rounded-br-md bg-white shadow-xl">
            <div className='flex flex-col justify-center'>
                <button
                    className="text-2xl font-semibold text-primary text-center p-2 mt-7 mb-2"
                    onClick={() => {
                        window.location.href = '/admin/dashboard';
                    }}
                >
                    EduMaster
                </button>
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
