import { Logout, Reply, WavingHand } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

function AdminHeader() {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.clear();
        router.replace('/admin');
    };

    return (
        <header className="w-full h-[50px] flex justify-between items-center px-3 bg-white">
            <div className="flex gap-2">
                <WavingHand className="text-yellow-400" />
                <span className="text-base text-gray-600 font-medium italic">Xin chào, Admin!</span>
            </div>
            <div className="flex gap-5">
                <button
                    type="button"
                    className="flex gap-1 text-gray-600"
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >
                    <Reply />
                    <span className="text-base font-medium">Về trang web</span>
                </button>
                <button
                    type="button"
                    className="flex gap-1 text-gray-600"
                    onClick={handleLogout}
                >
                    <Logout />
                    <span className="text-base  font-medium">Đăng xuất</span>
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
