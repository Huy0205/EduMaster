'use client';
import {
    AccountCircle,
    Assessment,
    FactCheck,
    Help,
    LibraryBooks,
    MenuBook,
    OndemandVideo,
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const stats = [
        { icon: '👨‍🎓', label: 'Tổng số học sinh', value: 1200 },
        { icon: '📝', label: 'Tổng số đề thực hành', value: 50 },
        { icon: '📖', label: 'Tổng số đề kiểm tra', value: 320 },
    ];

    const managementItems = [
        { icon: <AccountCircle />, label: 'Người dùng', href: '/admin/users' },
        { icon: <LibraryBooks />, label: 'Chương mục', href: '/admin/topics' },
        { icon: <MenuBook />, label: 'Bài học', href: '/admin/lessons' },
        { icon: <OndemandVideo />, label: 'Bài giảng', href: '/admin/theories' },
        { icon: <Help />, label: 'Câu hỏi thực hành', href: '/admin/questions/practice' },
        { icon: <Help />, label: 'Câu hỏi kiểm tra', href: '/admin/questions/quiz' },
        { icon: <Assessment />, label: 'Đề thực hành', href: '/admin/practices' },
        { icon: <FactCheck />, label: 'Đề kiểm tra', href: '/admin/quizzes' },
    ];

    // Dữ liệu cho biểu đồ
    const chartData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
        datasets: [
            {
                label: 'Số học sinh mới',
                data: [200, 150, 300, 250, 400, 350],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full h-full p-6 overflow-y-auto">
            <h1 className="text-3xl text-center font-bold mb-6">Trang quản trị</h1>

            <h2 className="text-2xl font-semibold mb-4">📈 Thống kê số học sinh</h2>
            <div className="w-full flex justify-center items-center">
                <div className="w-full max-w-4xl h-[460px] bg-white mb-5">
                    <Bar
                        data={chartData}
                        options={{ maintainAspectRatio: false }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform"
                    >
                        <span className="text-4xl">{stat.icon}</span>
                        <div>
                            <p className="text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mục quản lý */}
            <h2 className="text-2xl font-semibold mb-4">⚙️ Quản lý</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {managementItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform border border-gray-200"
                    >
                        <span className="text-3xl text-blue-500">{item.icon}</span>
                        <p className="text-lg font-semibold">{item.label}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
