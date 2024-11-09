import { Logout, Reply, WavingHand } from '@mui/icons-material';

function AdminHeader() {
    return (
        <header className="w-full h-[50px] flex justify-between items-center px-3 bg-white shadow-xl">
            <div className="flex gap-2">
                <WavingHand className="text-yellow-400" />
                <span className="text-base text-gray-600 font-medium italic">Xin chào, Admin!</span>
            </div>
            <div className="flex gap-5">
                <button
                    type="button"
                    className="flex gap-1 text-gray-600"
                >
                    <Reply />
                    <span className="text-base font-medium">Về trang web</span>
                </button>
                <button
                    type="button"
                    className="flex gap-1 text-gray-600"
                >
                    <Logout />
                    <span className="text-base  font-medium">Đăng xuất</span>
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
