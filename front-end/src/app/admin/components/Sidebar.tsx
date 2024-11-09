import AdminMenu from './Menu';

function AdminSidebar() {
    return (
        <aside className="w-full h-full bg-white shadow-xl">
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
            <div className="px-3 mt-5">
                <select className="w-full px-2 py-2 border border-gray-600 rounded-md outline-none text-base text-black">
                    {[...Array(5)].map((_, i) => (
                        <option
                            key={i}
                            value={i}
                        >
                            Lớp {i + 1}
                        </option>
                    ))}
                </select>
            </div>
            <AdminMenu />
        </aside>
    );
}

export default AdminSidebar;
