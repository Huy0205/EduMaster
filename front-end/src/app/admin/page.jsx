import Link from 'next/link';
import { FaUser, FaBook, FaTasks, FaClipboard } from 'react-icons/fa';

function Dashboard() {
  const items = [
    { label: 'Người Dùng', icon: <FaUser className="text-blue-600" />, color: 'text-blue-600',href:'admin/user' },
    { label: 'Quản lý bài học lý thuyết', icon: <FaBook className="text-yellow-500" />, color: 'text-yellow-500',href:'admin/baihoc' },
    { label: 'Quản lý ôn tập', icon: <FaTasks className="text-green-500" />, color: 'text-green-500',href:'admin/ontap' },
    { label: 'Quản lý bài kiểm tra', icon: <FaClipboard className="text-red-500" />, color: 'text-red-500',href:'admin/kiemtra' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-semibold mt-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-4xl">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center justify-center bg-white border rounded-lg shadow-md p-6 w-64 h-36 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <span className={`text-xl font-medium ${item.color}`}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
