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
import { useEffect, useState } from 'react';
import { PracticeService, QuizService, UserService } from '~/services';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UsersPerMonthType {
    month: string;
    total_users: number;
}

export default function Dashboard() {
    const [totalStudent, setTotalStudent] = useState(0);
    const [totalPractices, setTotalPractices] = useState(0);
    const [totalQuizzes, setTotalQuizzes] = useState(0);
    const [newUsersPerMonth, setNewUsersPerMonth] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endMonth = new Date();
                const startMonth = new Date();
                startMonth.setMonth(endMonth.getMonth() - 5);

                const [countStudentRes, countPracticesRes, countQuizzesRes, newUsersPerMonthRes] =
                    await Promise.all([
                        UserService.countStudent(),
                        PracticeService.countAllPractices(),
                        QuizService.countAllQuizzes(),
                        UserService.getNewUsersPerMonth(
                            startMonth.toISOString().slice(0, 7),
                            endMonth.toISOString().slice(0, 7),
                        ),
                    ]);

                const { data: countStudentData, message: countStudentMessage } =
                    countStudentRes.data;
                if (countStudentData >= 0) {
                    setTotalStudent(countStudentData);
                } else {
                    throw Error(countStudentMessage);
                }

                const { data: countPracticesData, message: countPracticesMessage } =
                    countPracticesRes.data;
                if (countPracticesData >= 0) {
                    setTotalPractices(countPracticesData);
                } else {
                    throw Error(countPracticesMessage);
                }

                const { data: countQuizzesData, message: countQuizzesMessage } =
                    countQuizzesRes.data;
                if (countQuizzesData >= 0) {
                    setTotalQuizzes(countQuizzesData);
                } else {
                    throw Error(countQuizzesMessage);
                }

                const { data: newUsersPerMonthData, message: newUsersPerMonthMessage } =
                    newUsersPerMonthRes.data;
                if (newUsersPerMonthData) {
                    console.log(newUsersPerMonthData);
                    setNewUsersPerMonth(newUsersPerMonthData);
                } else {
                    throw Error(newUsersPerMonthMessage);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { icon: '👨‍🎓', label: 'Tổng số học sinh', value: totalStudent },
        { icon: '📝', label: 'Tổng số đề thực hành', value: totalPractices },
        { icon: '📖', label: 'Tổng số đề kiểm tra', value: totalQuizzes },
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

    const chartData = {
        labels: newUsersPerMonth.map((item: UsersPerMonthType) => item.month),
        datasets: [
            {
                label: 'Số học sinh mới',
                data: newUsersPerMonth.map((item: UsersPerMonthType) => item.total_users),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="w-full h-full p-6 overflow-y-auto">
            <h1 className="text-3xl text-center font-bold mb-6">Trang quản trị</h1>

            <h2 className="text-2xl font-semibold mb-4">📈 Thống kê số học sinh</h2>
            <div className="w-full flex justify-center items-center">
                <div className="w-full max-w-4xl h-[460px] bg-white mb-5">
                    <Bar
                        data={chartData}
                        options={options}
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
